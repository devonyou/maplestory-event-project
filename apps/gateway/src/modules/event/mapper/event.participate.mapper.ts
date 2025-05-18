import {
    EventConditionTypeToString,
    EventMicroService,
    EventParticipateStatusToString,
    StringToEventRewardType,
} from '@app/repo';
import { format } from 'date-fns';

export class EventParticipateMapper {
    static toEventParticipate(participate: EventMicroService.EventParticipate): EventMicroService.EventParticipate {
        return {
            rewardType: StringToEventRewardType[participate.rewardType],
            amount: participate.amount,
            userId: participate.userId,
            status: EventParticipateStatusToString[participate.status],
            rejectedReason: participate.rejectedReason,
            event: {
                title: participate.event.title,
                isActive: participate.event.isActive,
                startDate: participate.event.startDate,
                endDate: participate.event.endDate,
                eventCondition: {
                    type: EventConditionTypeToString[participate.event.eventCondition.type],
                    payload: participate.event.eventCondition.payload,
                },
            },
            createdAt: format(participate.createdAt, 'yyyy-MM-dd HH:mm:ss'),
        };
    }
}
