import { BossMicroService } from '../grpc';

export const EventBossTypeToString = {
    [BossMicroService.EventBossType.SWOO]: 'SWOO',
    [BossMicroService.EventBossType.DEMIAN]: 'DEMIAN',
};

export const StringToEventBossType = {
    ['SWOO']: BossMicroService.EventBossType.SWOO,
    ['DEMIAN']: BossMicroService.EventBossType.DEMIAN,
};
