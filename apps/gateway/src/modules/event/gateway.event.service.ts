import { EventMicroService } from '@app/repo';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateEventRequest } from './dto/create.event.dto';
import { lastValueFrom } from 'rxjs';
import { CreateEventRewardRequest } from './dto/create.event.reward.dto';
import { EventMapper } from './mapper/event.mapper';
import { EventRewardMapper } from './mapper/event.reward.mapper';

@Injectable()
export class GatewayEventService implements OnModuleInit {
    private eventService: EventMicroService.EventServiceClient;

    constructor(
        @Inject(EventMicroService.EVENT_SERVICE_NAME)
        private readonly eventMicroService: ClientGrpc,
    ) {}

    onModuleInit() {
        this.eventService = this.eventMicroService.getService(EventMicroService.EVENT_SERVICE_NAME);
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
        return EventMapper.toEvent(result);
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
}
