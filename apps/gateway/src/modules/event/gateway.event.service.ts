import { EventMicroService } from '@app/repo';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

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
}
