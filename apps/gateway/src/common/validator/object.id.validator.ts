import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValidObjectId } from 'mongoose';

@ValidatorConstraint({ async: true })
export class ObjectIdValidator implements ValidatorConstraintInterface {
    validate(id: string): any {
        if (typeof id !== 'string') return false;
        return isValidObjectId(id);
    }

    defaultMessage() {
        return '올바른 ID가 아닙니다.';
    }
}
