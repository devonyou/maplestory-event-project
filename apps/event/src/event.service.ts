import { AttendanceMicroService, BossMicroService, EventMicroService, EventRewardTypeToString } from '@app/repo';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventDocument } from './document/event.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GrpcAlreadyExistsException, GrpcNotFoundException } from 'nestjs-grpc-exceptions';
import { EventRewardDocument } from './document/event.reward.document';
import { EventParticipateDocument } from './document/event.participate.document';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
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
        @Inject('EVENT_PARTICIPATE_SERVICE') private rmqClient: ClientProxy,
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
        const stream = this.rmqClient.send('event-participate', request);
        return lastValueFrom(stream);
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
