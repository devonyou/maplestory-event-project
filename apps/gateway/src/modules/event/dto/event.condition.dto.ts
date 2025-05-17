import { IsEnum, IsObject, Validate } from 'class-validator';
import { EventMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';
import { EventConditionValidator } from 'apps/gateway/src/common/validator/event.condition.validator';

export class EventCondition implements EventMicroService.EventCondition {
    @IsEnum(EventMicroService.EventConditionType, { message: 'type이 올바르지 않습니다. (ATTENDANCE, CLEAR_BOSS)' })
    @ApiProperty({ description: 'type', enum: EventMicroService.EventConditionType })
    type: EventMicroService.EventConditionType;

    @IsObject()
    @Validate(EventConditionValidator)
    @ApiProperty({ description: 'payload', type: Object, example: { bossid: '스우' } })
    payload: Record<string, any>;
}
