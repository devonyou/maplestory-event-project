import { EventMicroService, EventRewardTypeToString } from '@app/repo';

export class EventRewardMapper {
    static toEventReward(
        dto: EventMicroService.CreateEventRewardResponse,
    ): EventMicroService.CreateEventRewardResponse {
        return {
            eventId: dto.eventId,
            eventTitle: dto.eventTitle,
            eventReward: {
                id: dto.eventReward.id.toString(),
                type: EventRewardTypeToString[dto.eventReward.type],
                amount: dto.eventReward.amount,
            },
        };
    }
}
