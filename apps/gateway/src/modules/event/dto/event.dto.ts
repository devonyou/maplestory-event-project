import { EventMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsObject, IsString, ValidateNested } from 'class-validator';
import { EventCondition } from './event.condition.dto';
import { Type } from 'class-transformer';

export class EventDto implements EventMicroService.Event {
    @IsString({ message: '이벤트 ID가 올바르지 않습니다.' })
    @ApiProperty({ description: '이벤트 ID', type: String, example: '123' })
    id: string;

    @IsString({ message: '이벤트 제목이 올바르지 않습니다.' })
    @ApiProperty({ description: '이벤트 제목', type: String, example: '스우 클리어' })
    title: string;

    @IsObject({ message: '이벤트 조건이 올바르지 않습니다.' })
    @ApiProperty({
        description: '이벤트 조건',
        type: EventCondition,
        example: { type: 'CLEAR_BOSS', payload: { bossid: '스우' } },
    })
    @ValidateNested()
    @Type(() => EventCondition)
    eventCondition: EventCondition;

    @IsArray({ message: '이벤트 보상 아이템이 올바르지 않습니다.' })
    eventRewardItems: EventMicroService.EventReward[];

    @IsString({ message: '이벤트 시작일이 올바르지 않습니다.' })
    @ApiProperty({ description: '이벤트 시작일', type: String, example: '2025-05-01' })
    startDate: string;

    @IsString({ message: '이벤트 종료일이 올바르지 않습니다.' })
    @ApiProperty({ description: '이벤트 종료일', type: String, example: '2025-06-30' })
    endDate: string;

    @IsBoolean({ message: '활성화 여부가 올바르지 않습니다.' })
    @ApiProperty({ description: '활성화 여부', type: Boolean, example: true })
    isActive: boolean;
}
