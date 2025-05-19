import { AttendanceMicroService, BossMicroService, EventMicroService, EventRewardTypeToString } from '@app/repo';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Redis from 'ioredis';
import { GrpcInternalException, GrpcNotFoundException } from 'nestjs-grpc-exceptions';
import { EventDocument } from '../../document/event.document';
import { EventParticipateDocument } from '../../document/event.participate.document';
import { EventRewardDocument } from '../../document/event.reward.document';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EventWorkerService implements OnModuleInit {
    private redis: Redis;
    private bossService: BossMicroService.BossServiceClient;
    private attendanceService: AttendanceMicroService.AttendanceServiceClient;

    constructor(
        private readonly redisService: RedisService,
        @InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>,
        @InjectModel(EventRewardDocument.name) private readonly eventRewardModel: Model<EventRewardDocument>,
        @InjectModel(EventParticipateDocument.name)
        private readonly eventParticipateModel: Model<EventParticipateDocument>,
        @Inject(BossMicroService.BOSS_SERVICE_NAME) private readonly bossMicroService: ClientGrpc,
        @Inject(AttendanceMicroService.ATTENDANCE_SERVICE_NAME) private readonly attendanceMicroService: ClientGrpc,
    ) {
        this.redis = redisService.getOrThrow();
    }

    onModuleInit() {
        this.bossService = this.bossMicroService.getService(BossMicroService.BOSS_SERVICE_NAME);
        this.attendanceService = this.attendanceMicroService.getService(AttendanceMicroService.ATTENDANCE_SERVICE_NAME);
    }

    async process(data: EventMicroService.ParticipateEventRequest, context: RmqContext) {
        const { userId, eventId, rewardType } = data;

        const lockKey = `lock:participate:${userId}:${eventId}`;
        const lockValue = userId;
        const ttl = 10;

        // 이벤트 조회
        const event = await this.findEventById(eventId);
        const startDate = event.startDate;
        const endDate = event.endDate;

        const isLocked = await this.acquireLock(lockKey, lockValue, ttl);
        if (!isLocked) {
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
            return await this.rejectParticipateEvent({
                event,
                rewardType,
                userId,
                rejectedReason: '이벤트 참여에 실패했습니다.',
            });
        }

        try {
            // 이벤트 보상 조회
            const rewards = event.rewards;
            if (!rewards?.length) {
                return await this.rejectParticipateEvent({
                    event,
                    rewardType,
                    userId,
                    rejectedReason: '보상이 등록되지 않은 이벤트 입니다. 관리자에게 문의해주세요.',
                });
            }

            // 이벤트 기간 검증
            const now = new Date();
            if (now < startDate || now > endDate) {
                return await this.rejectParticipateEvent({
                    event,
                    rewardType,
                    userId,
                    rejectedReason: '이벤트 기간이 아닙니다.',
                });
            }

            // 이벤트 활성화
            if (!event.isActive) {
                return await this.rejectParticipateEvent({
                    event,
                    rewardType,
                    userId,
                    rejectedReason: '이벤트가 활성화 상태가 아닙니다.',
                });
            }

            const participateEvent = await this.findParticipateEvent(eventId, userId);
            if (participateEvent) {
                return await this.rejectParticipateEvent({
                    event,
                    rewardType,
                    userId,
                    rejectedReason: '보상 수령 이력이 존재합니다.',
                });
            }

            // 이벤트 조건 검증
            if (event.eventCondition.type === EventMicroService.EventConditionType.CLEAR_BOSS) {
                // 보스 클리어 조회
                const bossClear = await this.findBossClear(
                    event.eventCondition.payload.bossid,
                    userId,
                    startDate,
                    endDate,
                );
                if (!bossClear.isCleared) {
                    return await this.rejectParticipateEvent({
                        event,
                        rewardType,
                        userId,
                        rejectedReason: `이벤트 기간 내 ${event.eventCondition.payload.bossid} 보스를 처리해야 참여할 수 있습니다.`,
                    });
                }
            } else if (event.eventCondition.type === EventMicroService.EventConditionType.ATTENDANCE) {
                // 출석 조회
                const attendance = await this.findAttendance(userId, startDate, endDate);
                if (attendance.attendanceDays < event.eventCondition.payload.days) {
                    return await this.rejectParticipateEvent({
                        event,
                        rewardType,
                        userId,
                        rejectedReason: `이벤트 기간 내 출석체크 조건이 충족하지 않습니다. (${attendance.attendanceDays}/${event.eventCondition.payload.days})`,
                    });
                }
            }

            const reward = rewards.find(reward => reward.type === rewardType);
            if (!reward) {
                return await this.rejectParticipateEvent({
                    event,
                    rewardType,
                    userId,
                    rejectedReason: `해당 이벤트에 ${EventRewardTypeToString[rewardType]} 보상이 존재하지 않습니다.`,
                });
            }

            // 보상 수령
            await this.eventParticipateModel.create({
                eventId,
                userId,
                rewardType,
                amount: reward.amount,
                status: EventMicroService.EventParticipateStatus.SUCCESS,
            });

            return {
                status: EventMicroService.EventParticipateStatus.SUCCESS,
                message: '보상 수령 완료',
            };
        } catch (error) {
            throw new GrpcInternalException('이벤트 참여에 실패했습니다.');
        } finally {
            await this.releaseLock(lockKey, lockValue);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
        }
    }

    async acquireLock(lockKey: string, lockValue: string, ttl: number) {
        const acquired = await this.redis.set(lockKey, lockValue, 'EX', ttl, 'NX');
        return acquired === 'OK';
    }

    async releaseLock(lockKey: string, lockValue: string) {
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;
        const result = await this.redis.eval(script, 1, [lockKey, lockValue]);
        return result === 1;
    }

    async findEventById(eventId: string) {
        try {
            const event = await this.eventModel
                .findById(eventId)
                .populate<{ rewards: EventRewardDocument[] }>('rewards')
                .exec();
            if (!event) {
                throw new GrpcNotFoundException('해당 ID의 이벤트가 존재하지 않습니다.');
            }
            return event;
        } catch (error) {
            throw new GrpcNotFoundException('해당 ID의 이벤트가 존재하지 않습니다.');
        }
    }

    async rejectParticipateEvent({
        event,
        rewardType,
        userId,
        rejectedReason,
    }: {
        event: EventDocument;
        rewardType: EventMicroService.EventRewardType;
        userId: string;
        rejectedReason: string;
    }) {
        await this.eventParticipateModel.create({
            eventId: event._id,
            userId,
            rejectedReason,
            status: EventMicroService.EventParticipateStatus.REJECTED,
            rewardType,
        });

        return {
            status: EventMicroService.EventParticipateStatus.REJECTED,
            message: rejectedReason,
        };
    }

    async findParticipateEvent(eventId: string, userId: string) {
        return this.eventParticipateModel.findOne({
            eventId,
            userId,
            status: EventMicroService.EventParticipateStatus.SUCCESS,
        });
    }

    async findBossClear(bossId: BossMicroService.EventBossType, userId: string, startDate: Date, endDate: Date) {
        const stream = this.bossService.findBossClear({
            userId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            bossId,
        });
        const result = await lastValueFrom(stream);
        return result;
    }

    async findAttendance(userId: string, startDate: Date, endDate: Date) {
        const stream = this.attendanceService.findAttendance({
            userId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        const result = await lastValueFrom(stream);
        return result;
    }
}
