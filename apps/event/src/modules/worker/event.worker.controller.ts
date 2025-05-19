import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EventWorkerService } from './event.worker.service';
import { EventMicroService } from '@app/repo';

@Controller()
export class EventWorkerController {
    constructor(private readonly eventWorkerService: EventWorkerService) {}

    @MessagePattern('event-participate')
    async handleEventParticipate(
        @Payload() data: EventMicroService.ParticipateEventRequest,
        @Ctx() context: RmqContext,
    ) {
        return await this.eventWorkerService.process(data, context);
    }
}
