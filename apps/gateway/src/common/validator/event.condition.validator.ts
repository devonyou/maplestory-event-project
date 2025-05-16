import { EventConditionType } from '@app/repo';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class EventConditionValidator implements ValidatorConstraintInterface {
    async validate(payload: any, args: ValidationArguments) {
        const object = args.object as any;
        if (!object.type) return false;

        switch (object.type) {
            case EventConditionType.ATTENDANCE:
                return typeof payload === 'object' && typeof payload.days === 'number';

            case EventConditionType.CLEAR_BOSS:
                return typeof payload === 'object' && typeof payload.bossid === 'string';

            default:
                return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const object = args.object as any;
        switch (object.type) {
            case EventConditionType.ATTENDANCE:
                return `'payload'는 ATTENDANCE 타입일 때 숫자형 'days' 프로퍼티를 포함해야 합니다.`;
            case EventConditionType.CLEAR_BOSS:
                return `'payload'는 CLEAR_BOSS 타입일 때 문자형 'bossid' 프로퍼티를 포함해야 합니다.`;
            default:
                return `'payload'가 '${object.type}' 타입에 적합하지 않습니다.`;
        }
    }
}
