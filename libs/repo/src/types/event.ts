import { EventMicroService } from '../grpc';

export const EventConditionTypeToString = {
    [EventMicroService.EventConditionType.ATTENDANCE]: 'ATTENDANCE',
    [EventMicroService.EventConditionType.CLEAR_BOSS]: 'CLEAR_BOSS',
};

export const StringToEventConditionType = {
    ['ATTENDANCE']: EventMicroService.EventConditionType.ATTENDANCE,
    ['CLEAR_BOSS']: EventMicroService.EventConditionType.CLEAR_BOSS,
};

export const EventRewardTypeToString = {
    [EventMicroService.EventRewardType.MAPLE_POINT]: 'MAPLE_POINT',
    [EventMicroService.EventRewardType.MAPLE_COIN]: 'MAPLE_COIN',
};

export const StringToEventRewardType = {
    ['MAPLE_POINT']: EventMicroService.EventRewardType.MAPLE_POINT,
    ['MAPLE_COIN']: EventMicroService.EventRewardType.MAPLE_COIN,
};

export const EventStatusToString = {
    [EventMicroService.EventStatus.ACTIVE]: 'ACTIVE',
    [EventMicroService.EventStatus.INACTIVE]: 'INACTIVE',
    [EventMicroService.EventStatus.COMPLETED]: 'COMPLETED',
};

export const EventParticipateStatusToString = {
    [EventMicroService.EventParticipateStatus.SUCCESS]: 'SUCCESS',
    [EventMicroService.EventParticipateStatus.REJECTED]: 'REJECTED',
};

export const StringToEventParticipateStatus = {
    ['SUCCESS']: EventMicroService.EventParticipateStatus.SUCCESS,
    ['REJECTED']: EventMicroService.EventParticipateStatus.REJECTED,
};
