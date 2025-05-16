import { IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { EventMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';

export class FindEventRequest {
    @IsBoolean({ message: '활성화 여부가 올바르지 않습니다.' })
    @ApiProperty({ description: '활성화 여부', type: Boolean, example: true })
    isActive: boolean;

    @IsEnum(EventMicroService.EventStatus, { message: '상태가 올바르지 않습니다. (ACTIVE, INACTIVE, COMPLETED)' })
    @ApiProperty({ description: '상태', type: String, example: 'ACTIVE' })
    status: EventMicroService.EventStatus;
}

export class FindEventResponse {
    @IsArray()
    @ValidateNested({ each: true })
    // @Type(() => EventMicroService.Event)
    events: EventMicroService.Event[];
}
