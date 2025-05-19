import { EventMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectIdValidator } from '../../../common/validator/object.id.validator';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDto } from './event.dto';
export class EventParticipate {
    @ApiProperty({ description: '유저 ID', example: '60a9b734b5d2b444c5d2b444' })
    userId: string;

    @ApiProperty({ description: '참여 상태', example: 'SUCCESS' })
    status: EventMicroService.EventParticipateStatus;

    @ApiProperty({ description: '거절 사유', example: '거절 사유' })
    rejectedReason: string;

    @ApiProperty({ description: '이벤트 참여 일시', example: 'yyyy-MM-dd HH:mm:ss' })
    createdAt: Date;

    @ApiProperty({ description: '이벤트 정보', type: EventDto })
    event: EventDto;
}

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
    // status: EventMicroService.EventParticipateStatus;
    status?: ['SUCCESS', 'REJECTED'];

    @ApiProperty({ description: '응답 메시지', example: '' })
    message: string;
}

export class FindEventParticipateUserRequest {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: '이벤트 ID' })
    eventId?: string;

    @IsOptional()
    @IsEnum(EventMicroService.EventParticipateStatus, {
        message: '유효한 상태코드가 아닙니다.[SUCCESS, REJECTED]',
    })
    @ApiProperty({
        description: '참여 상태',
        example: 'SUCCESS',
        type: String,
    })
    // status?: EventMicroService.EventParticipateStatus;
    status?: ['SUCCESS', 'REJECTED'];
}

export class FindEventParticipateAdminRequest extends FindEventParticipateUserRequest {
    @IsOptional()
    @Validate(ObjectIdValidator, { message: '유효하지 않은 유저 ID입니다.' })
    @ApiProperty({ description: '[ADMIN, OPERATOR, AUDITOR] 유저 ID' })
    userId?: string;
}

export class FindEventParticipateResponse {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventParticipate)
    @ApiProperty({ description: '이벤트 참여 결과 목록', type: [EventParticipate] })
    eventParticipates: EventParticipate[];
}
