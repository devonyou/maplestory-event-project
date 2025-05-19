import { AuthMicroService, EventMicroService } from '@app/repo';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateEventRequest } from './dto/create.event.dto';
import { lastValueFrom } from 'rxjs';
import { CreateEventRewardRequest } from './dto/create.event.reward.dto';
import { EventMapper } from './mapper/event.mapper';
import { EventRewardMapper } from './mapper/event.reward.mapper';
import { ParticipateEventRequest } from './dto/participate.dto';
import { EventParticipateMapper } from './mapper/event.participate.mapper';

@Injectable()
export class GatewayEventService implements OnModuleInit {
    private eventService: EventMicroService.EventServiceClient;
    private authService: AuthMicroService.AuthServiceClient;

    constructor(
        @Inject(EventMicroService.EVENT_SERVICE_NAME)
        private readonly eventMicroService: ClientGrpc,
        @Inject(AuthMicroService.AUTH_SERVICE_NAME)
        private readonly authMicroService: ClientGrpc,
    ) {}

    onModuleInit() {
        this.eventService = this.eventMicroService.getService(EventMicroService.EVENT_SERVICE_NAME);
        this.authService = this.authMicroService.getService(AuthMicroService.AUTH_SERVICE_NAME);
    }

    async createEvent(dto: CreateEventRequest) {
        const stream = this.eventService.createEvent(dto);
        const result = await lastValueFrom(stream);
        return EventMapper.toEvent(result);
    }

    async findEventList() {
        const stream = this.eventService.findEventList({
            isActive: true,
            status: EventMicroService.EventStatus.ACTIVE,
        });
        const result = await lastValueFrom(stream);
        return EventMapper.toEventList(result);
    }

    async findEventById(eventId: string) {
        const stream = this.eventService.findEventById({ eventId });
        const result = await lastValueFrom(stream);
        return EventMapper.toEventDetail(result);
    }

    async createEventReward(eventId: string, body: CreateEventRewardRequest) {
        const stream = this.eventService.createEventReward({
            eventId,
            eventReward: {
                id: null,
                type: body.type,
                amount: body.amount,
            },
        });
        const result = await lastValueFrom(stream);
        return EventRewardMapper.toEventReward(result);
    }

    async participateEvent(eventId: string, userId: string, body: ParticipateEventRequest) {
        const stream = this.eventService.participateEvent({
            eventId,
            rewardType: body.rewardType,
            userId: userId,
        });
        const result = await lastValueFrom(stream);
        return result;
    }

    async findEventParticipate(dto: {
        eventId?: string;
        status?: EventMicroService.EventParticipateStatus;
        userId?: string;
    }) {
        const { users } = await lastValueFrom(
            this.authService.findUserList({
                userId: dto.userId,
            }),
        );

        if (!users?.length) {
            throw new BadRequestException('존재하지 않는 유저입니다.');
        }

        const stream = this.eventService.findEventParticipate(dto);
        const result = await lastValueFrom(stream);
        return {
            eventParticipates: result?.eventParticipates?.map(participate =>
                EventParticipateMapper.toEventParticipate(participate),
            ),
        };
    }
}
