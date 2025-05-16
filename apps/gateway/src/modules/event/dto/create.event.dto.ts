import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsObject,
    IsString,
    Validate,
    ValidateNested,
} from 'class-validator';
import { DateValidator } from '../../../common/validator/date.validator';
import { Type } from 'class-transformer';
import { EventConditionValidator } from '../../../common/validator/event.condition.validator';
import { EventConditionType, EventRewardType } from '@app/repo';

class EventCondition {
    @IsEnum(EventConditionType, { message: 'type이 올바르지 않습니다. (ATTENDANCE, CLEAR_BOSS)' })
    type: EventConditionType;

    @IsObject()
    @Validate(EventConditionValidator)
    payload: Record<string, any>;
}

class EventReward {
    @IsEnum(EventRewardType, { message: 'type이 올바르지 않습니다. (MAPLE_POINT, MAPLE_COIN)' })
    @ApiProperty({ description: '보상 타입', type: String, example: 'MAPLE_POINT' })
    type: EventRewardType;

    @IsNumber()
    amount: number;
}

export class CreateEventRequest {
    @ApiProperty({ description: '이벤트 제목', type: String, example: '스우 클리어 이벤트' })
    @IsString()
    title: string;

    @ApiProperty({
        description: '이벤트 조건',
        type: String,
        example: { type: 'CLEAR_BOSS', payload: { bossid: '스우' } },
    })
    @IsObject()
    @ValidateNested()
    @Type(() => EventCondition)
    eventCondition: EventCondition;

    @ApiProperty({ description: '이벤트 보상', type: [EventReward], example: [{ type: 'MAPLE_POINT', amount: 10000 }] })
    @IsArray()
    @ValidateNested()
    @Type(() => EventReward)
    @ArrayNotEmpty({ message: '이벤트 보상 항목은 하나 이상이어야 합니다.' })
    eventRewardItems: EventReward[];

    @ApiProperty({ description: '이벤트 시작일', type: String, example: '2025-05-01' })
    @Validate(DateValidator)
    startDate: string;

    @ApiProperty({ description: '이벤트 종료일', type: String, example: '2025-06-30' })
    @Validate(DateValidator)
    endDate: string;

    @ApiProperty({ description: '이벤트 활성화 여부', type: Boolean, example: true })
    @IsBoolean()
    isActive: boolean;
}
