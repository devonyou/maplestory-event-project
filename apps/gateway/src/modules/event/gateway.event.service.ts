import { EventMicroService, StringToEventConditionType } from '@app/repo';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateEventRequest } from './dto/create.event.dto';
import { lastValueFrom } from 'rxjs';

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
        const stream = this.eventService.createEvent({
            ...dto,
            eventCondition: {
                type: StringToEventConditionType[dto.eventCondition.type],
                payload: dto.eventCondition.payload,
            },
        });
        const result = await lastValueFrom(stream);
        return result;
    }

    async findEventList() {
        const stream = this.eventService.findEventList({
            isActive: true,
            status: EventMicroService.EventStatus.ACTIVE,
        });
        const result = await lastValueFrom(stream);
        return result;
    }

    async findEventById(eventId: string) {
        const stream = this.eventService.findEventById({ eventId });
        const result = await lastValueFrom(stream);
        return result;
    }
}
