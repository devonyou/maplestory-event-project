import { IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { EventMicroService } from '@app/repo';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { EventDto } from './event.dto';
import { Type } from 'class-transformer';

export class EventSummaryDto extends PickType(EventDto, ['id', 'title', 'isActive'] as const) {}

export class FindEventListRequest {
    @IsBoolean({ message: '활성화 여부가 올바르지 않습니다.' })
    @ApiProperty({ description: '활성화 여부', type: Boolean, example: true })
    isActive: boolean;

    @IsEnum(EventMicroService.EventStatus, { message: '상태가 올바르지 않습니다. (ACTIVE, INACTIVE, COMPLETED)' })
    @ApiProperty({ description: '상태', type: String, example: 'ACTIVE' })
    status: EventMicroService.EventStatus;
}

export class FindEventListResponse {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventSummaryDto)
    @ApiProperty({ description: '이벤트 목록', type: [EventSummaryDto] })
    events: EventSummaryDto[];
}

export class FindEventResponse extends OmitType(EventDto, ['id', 'title', 'isActive'] as const) {}
