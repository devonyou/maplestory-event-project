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
            eventCondition: {
                type: event.eventCondition.type,
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
                // eventRewardItems: event.eventRewardItems,
                eventRewardItems: null,
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
            // eventRewardItems: event.eventRewardItems,
            eventRewardItems: null,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            isActive: event.isActive,
        };
    }

    async createEventReward(
        request: EventMicroService.CreateEventRewardRequest,
    ): Promise<EventMicroService.CreateEventRewardResponse> {
        const eventReward = await this.eventService.createEventReward(request);
        const event = await this.eventService.findEventById(eventReward.eventId.toString());

        return {
            eventId: eventReward.eventId.toString(),
            eventTitle: event.title,
            eventReward: {
                id: eventReward.id.toString(),
                type: eventReward.type,
                amount: eventReward.amount,
            },
        };
    }
}
