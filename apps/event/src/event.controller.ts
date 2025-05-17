import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { EventConditionTypeToString, EventMicroService } from '@app/repo';

@Controller()
@EventMicroService.EventServiceControllerMethods()
export class EventController implements EventMicroService.EventServiceController {
    constructor(private readonly eventService: EventService) {}

    async createEvent(request: EventMicroService.CreateEventRequest): Promise<EventMicroService.CreateEventResponse> {
        const event = await this.eventService.createEvent(request);
        return {
            id: event.id.toString(),
            title: event.title,
            eventCondition: {
                type: EventConditionTypeToString[event.eventCondition.type],
                payload: event.eventCondition.payload,
            },
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            isActive: event.isActive,
        };
    }

    async findEventList(
        request: EventMicroService.FindEventListRequest,
    ): Promise<EventMicroService.FindEventListResponse> {
        const events = await this.eventService.findEventList(request);
        return {
            events: events.map(event => ({
                id: event.id.toString(),
                title: event.title,
                eventCondition: event.eventCondition,
                eventRewardItems: event.eventRewardItems,
                startDate: event.startDate.toISOString(),
                endDate: event.endDate.toISOString(),
                isActive: event.isActive,
            })),
        };
    }

    async findEventById(
        request: EventMicroService.FindEventByIdRequest,
    ): Promise<EventMicroService.FindEventByIdResponse> {
        const event = await this.eventService.findEventById(request.eventId);
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
