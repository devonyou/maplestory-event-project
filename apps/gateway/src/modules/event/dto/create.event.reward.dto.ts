import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateEventRewardDto } from './event.reward.dto';

export class CreateEventRewardRequest extends PickType(CreateEventRewardDto, ['type', 'amount']) {}

export class CreateEventRewardResponse {
    @ApiProperty({ description: '이벤트 ID', type: String, example: '1234' })
    eventId: string;

    @ApiProperty({ description: '이벤트 제목', type: String, example: '스우 클리어' })
    eventTitle: string;

    @ApiProperty({
        description: '이벤트 보상',
        type: CreateEventRewardDto,
        example: { eventId: '1234', type: 'MAPLE_POINT', amount: 1000 },
    })
    eventReward: CreateEventRewardDto;
}
