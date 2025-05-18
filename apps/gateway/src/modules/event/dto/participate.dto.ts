import { EventMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ParticipateEventRequest {
    @IsNotEmpty({ message: 'rewardType은 비어있을 수 없습니다.' })
    @IsEnum(EventMicroService.EventRewardType, {
        message: 'rewardType은 유효한 이벤트 보상 타입이어야 합니다.[MAPLE_POINT, MAPLE_COIN]',
    })
    @ApiProperty({
        description: '이벤트 보상 타입',
        enum: EventMicroService.EventRewardType,
        example: 'MAPLE_POINT',
    })
    rewardType: EventMicroService.EventRewardType;
}

export class ParticipateEventResponse {
    @IsEnum(EventMicroService.EventParticipateStatus)
    @ApiProperty({ enum: EventMicroService.EventParticipateStatus, description: '참여 결과', example: 'SUCCESS' })
    status: EventMicroService.EventParticipateStatus;

    @ApiProperty({ description: '응답 메시지', example: '' })
    message: string;
}
