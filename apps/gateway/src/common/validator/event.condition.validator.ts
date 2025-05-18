import { BossMicroService, EventMicroService, StringToEventConditionType } from '@app/repo';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class EventConditionValidator implements ValidatorConstraintInterface {
    async validate(payload: any, args: ValidationArguments) {
        const object = args.object as any;
        if (!object?.type) return false;

        const ValidBossIds = Object.keys(BossMicroService.EventBossType);

        switch (StringToEventConditionType[object.type]) {
            case EventMicroService.EventConditionType.ATTENDANCE:
                return typeof payload === 'object' && typeof payload?.days === 'number';
            case EventMicroService.EventConditionType.CLEAR_BOSS:
                return (
                    typeof payload === 'object' &&
                    typeof payload?.bossid === 'string' &&
                    ValidBossIds.includes(payload?.bossid)
                );
            default:
                return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const object = args.object as any;
        switch (StringToEventConditionType[object.type]) {
            case EventMicroService.EventConditionType.ATTENDANCE:
                return `'payload'는 ATTENDANCE 타입일 때 숫자형 'days' 프로퍼티를 포함해야 합니다.`;
            case EventMicroService.EventConditionType.CLEAR_BOSS:
                const payload = object?.payload;
                if (!('bossid' in payload)) {
                    return `'payload' 객체에 'bossid' 필드가 존재해야 합니다.`;
                }
                if (typeof payload?.bossid !== 'string') {
                    return `'bossid'는 문자열이어야 합니다.`;
                }
                return `'bossid'는 'SWOO' 또는 'DEMIAN' 중 하나여야 합니다. 현재 값: '${payload?.bossid}'`;
            default:
                return `'payload'가 '${object.type}' 타입에 적합하지 않습니다.`;
        }
    }
}
