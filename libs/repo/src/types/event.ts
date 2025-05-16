import { EventStatus } from '../grpc/proto/event';

export enum EventConditionType {
    ATTENDANCE = 'ATTENDANCE',
    CLEAR_BOSS = 'CLEAR_BOSS',
}

export const EventConditionTypeToString = {
    [EventConditionType.ATTENDANCE]: 0,
    [EventConditionType.CLEAR_BOSS]: 1,
};

export enum EventRewardType {
    MAPLE_POINT = 'MAPLE_POINT',
    MAPLE_COIN = 'MAPLE_COIN',
}

export const EventRewardTypeToString = {
    [EventRewardType.MAPLE_POINT]: 0,
    [EventRewardType.MAPLE_COIN]: 1,
};

export const EventStatusToString = {
    [EventStatus.ACTIVE]: 0,
    [EventStatus.INACTIVE]: 1,
    [EventStatus.COMPLETED]: 2,
};
