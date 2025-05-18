import { ApiProperty } from '@nestjs/swagger';
import { DateValidator } from 'apps/gateway/src/common/validator/date.validator';
import { Validate } from 'class-validator';

export class CheckAttendanceRequest {
    @ApiProperty({ description: '출석일', type: String, example: '2025-05-15' })
    @Validate(DateValidator, { message: 'attendanceDate가 올바르지 않습니다.' })
    attendanceDate: string;
}

export class CheckAttendanceResponse {
    @ApiProperty({ description: '출석 여부', type: Boolean, example: true })
    isChecked: boolean;
}
