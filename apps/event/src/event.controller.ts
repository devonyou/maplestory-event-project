import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { EventMicroService } from '@app/repo';

@Controller()
@EventMicroService.EventServiceControllerMethods()
export class EventController implements EventMicroService.EventServiceController {
    constructor(private readonly eventService: EventService) {}

    async createEvent(request: EventMicroService.CreateEventRequest): Promise<EventMicroService.CreateEventResponse> {
        const event = await this.eventService.createEvent(request);
        return {
            id: event.id.toString(),
            title: event.title,
            eventCondition: event.eventCondition,
            eventRewardItems: event.eventRewardItems,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            isActive: event.isActive,
        };
    }
}
