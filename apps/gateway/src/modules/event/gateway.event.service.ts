import { EventConditionTypeToString, EventMicroService, EventRewardTypeToString } from '@app/repo';
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

    getEvents() {
        throw new Error('Method not implemented.');
    }

    async createEvent(dto: CreateEventRequest) {
        const stream = this.eventService.createEvent({
            ...dto,
            eventCondition: {
                type: EventConditionTypeToString[dto.eventCondition.type],
                payload: dto.eventCondition.payload,
            },
            eventRewardItems: dto.eventRewardItems.map(item => ({
                type: EventRewardTypeToString[item.type],
                amount: item.amount,
            })),
        });
        const result = await lastValueFrom(stream);
        return result;
    }
}
