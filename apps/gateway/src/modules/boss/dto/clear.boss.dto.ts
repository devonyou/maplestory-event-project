import { BossMicroService } from '@app/repo';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, Validate } from 'class-validator';
import { DateValidator } from '../../../common/validator/date.validator';

export class ClearBossRequest {
    @IsEnum(BossMicroService.EventBossType, { message: 'bossId가 올바르지 않습니다.[SWOO, DEMIAN]' })
    @ApiProperty({ description: '보스 ID', enum: BossMicroService.EventBossType, example: 'SWOO' })
    bossId: BossMicroService.EventBossType;

    @ApiProperty({ description: '보스 처치일', type: String, example: '2025-05-15' })
    @Validate(DateValidator, { message: 'clearDate가 올바르지 않습니다.' })
    clearDate: string;
}

export class ClearBossResponse {
    @ApiProperty({ description: '보스 처치 여부', type: Boolean, example: true })
    isCleared: boolean;
}
