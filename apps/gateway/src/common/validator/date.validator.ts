import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { parse, isValid } from 'date-fns';

@ValidatorConstraint({ async: true })
export class DateValidator implements ValidatorConstraintInterface {
    validate(date: string): any {
        if (typeof date !== 'string') return false;
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        return isValid(parsedDate);
    }

    defaultMessage() {
        return '올바른 날짜가 아닙니다.';
    }
}
