import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EventMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventRewardDto {
    // @IsNotEmpty()
    // @IsString({ message: 'eventId는 문자열이어야 합니다.' })
    // @ApiProperty({ description: '이벤트 ID', type: String, example: '1234' })
    // eventId: string;

    @IsNotEmpty()
    @IsString({ message: 'type은 문자열이어야 합니다.' })
    @IsEnum(EventMicroService.EventRewardType, {
        message: 'type은 유효한 이벤트 보상 타입이어야 합니다.[MAPLE_POINT, MAPLE_COIN]',
    })
    @ApiProperty({
        description: '이벤트 보상 타입',
        enum: EventMicroService.EventRewardType,
        example: 'MAPLE_POINT',
    })
    type: EventMicroService.EventRewardType;

    @IsNotEmpty()
    @IsNumber({}, { message: 'amount은 숫자여야 합니다.' })
    @ApiProperty({ description: '이벤트 보상 금액', type: Number, example: 1000 })
    amount: number;
}
