import { EventConditionTypeToString, EventMicroService, EventRewardTypeToString } from '@app/repo';

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
            events: dto.events?.map(event => ({
                id: event.id.toString(),
                title: event.title,
            })),
        };
    }

    static toEventDetail(dto: EventMicroService.FindEventByIdResponse): EventMicroService.FindEventByIdResponse {
        return {
            ...this.toEvent(dto),
            eventRewardItems: dto.eventRewardItems?.map(item => ({
                id: item.id.toString(),
                type: EventRewardTypeToString[item.type],
                amount: item.amount,
            })),
        };
    }
}
