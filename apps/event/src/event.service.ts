import { AttendanceMicroService, BossMicroService, EventMicroService, EventRewardTypeToString } from '@app/repo';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventDocument } from './document/event.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GrpcAlreadyExistsException, GrpcNotFoundException } from 'nestjs-grpc-exceptions';
import { EventRewardDocument } from './document/event.reward.document';
import { EventParticipateDocument } from './document/event.participate.document';
import { ClientGrpc } from '@nestjs/microservices';
import { startOfDay, endOfDay } from 'date-fns';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EventService implements OnModuleInit {
    private bossService: BossMicroService.BossServiceClient;
    private attendanceService: AttendanceMicroService.AttendanceServiceClient;

    constructor(
        @InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>,
        @InjectModel(EventRewardDocument.name) private readonly eventRewardModel: Model<EventRewardDocument>,
        @InjectModel(EventParticipateDocument.name)
        private readonly eventParticipateModel: Model<EventParticipateDocument>,
        @Inject(BossMicroService.BOSS_SERVICE_NAME) private readonly bossMicroService: ClientGrpc,
        @Inject(AttendanceMicroService.ATTENDANCE_SERVICE_NAME) private readonly attendanceMicroService: ClientGrpc,
    ) {}

    onModuleInit() {
        this.bossService = this.bossMicroService.getService(BossMicroService.BOSS_SERVICE_NAME);
        this.attendanceService = this.attendanceMicroService.getService(AttendanceMicroService.ATTENDANCE_SERVICE_NAME);
    }

    async createEvent(dto: EventMicroService.CreateEventRequest): Promise<EventDocument> {
        return await this.eventModel.create({
            ...dto,
            startDate: startOfDay(dto.startDate),
            endDate: endOfDay(dto.endDate),
        });
    }

    findEventList(dto: EventMicroService.FindEventListRequest) {
        const { status } = dto;
        const filter: FilterQuery<EventDocument> = {};
        const now = new Date();

        if (status === EventMicroService.EventStatus.ACTIVE) {
            filter.startDate = { $lte: now };
            filter.endDate = { $gte: now };
        } else if (status === EventMicroService.EventStatus.INACTIVE) {
            filter.startDate = { $gt: now };
        } else if (status === EventMicroService.EventStatus.COMPLETED) {
            filter.endDate = { $lt: now };
        }

        return this.eventModel.find(filter).exec();
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

    async createEventReward(request: EventMicroService.CreateEventRewardRequest) {
        const { eventId, eventReward } = request;
        const event = await this.findEventById(eventId);

        const reward = event.rewards.find(reward => reward.type === eventReward.type);
        if (reward) {
            throw new GrpcAlreadyExistsException(
                `해당 이벤트에 ${EventRewardTypeToString[eventReward.type]} 보상이 이미 존재합니다.`,
            );
        }

        return await this.eventRewardModel.create({
            eventId,
            type: eventReward.type,
            amount: eventReward.amount,
        });
    }

    async participateEvent(request: EventMicroService.ParticipateEventRequest) {
        const { eventId, rewardType, userId } = request;

        // 이벤트 조회
        const event = await this.findEventById(eventId);
        const startDate = event.startDate;
        const endDate = event.endDate;

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

        // 이벤트 참여 조회
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
            const bossClear = await this.findBossClear(event.eventCondition.payload.bossid, userId, startDate, endDate);
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
            message: null,
        };
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

    async findParticipateEvent(eventId: string, userId: string) {
        return this.eventParticipateModel.findOne({
            eventId,
            userId,
            status: EventMicroService.EventParticipateStatus.SUCCESS,
        });
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

    async findEventParticipate(request: EventMicroService.FindEventParticipateRequest) {
        const { eventId, userId, status } = request;
        const filter: FilterQuery<EventParticipateDocument> = {};

        if (eventId) {
            filter.eventId = eventId;
        }

        if (userId) {
            filter.userId = userId;
        }

        if (status === EventMicroService.EventParticipateStatus.SUCCESS) {
            filter.status = status;
        } else if (status === EventMicroService.EventParticipateStatus.REJECTED) {
            filter.status = status;
        }

        if (eventId) await this.findEventById(eventId);

        return this.eventParticipateModel.find(filter).populate<{ event: EventDocument }>(['event']).exec();
    }
}
