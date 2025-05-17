import { EventConditionTypeToString, EventMicroService } from '@app/repo';

export class EventMapper {
    static toEvent(dto: EventMicroService.CreateEventResponse): EventMicroService.CreateEventResponse {
        return {
            id: dto.id.toString(),
            title: dto.title,
            eventCondition: {
                type: EventConditionTypeToString[dto.eventCondition.type],
                payload: dto.eventCondition.payload,
            },
            startDate: dto.startDate,
            endDate: dto.endDate,
            isActive: dto.isActive,
        };
    }

    static toEventList(dto: EventMicroService.FindEventListResponse): EventMicroService.FindEventListResponse {
        return {
            events: dto.events.map(event => ({
                id: event.id.toString(),
                title: event.title,
                isActive: event.isActive,
            })),
        };
    }
}
