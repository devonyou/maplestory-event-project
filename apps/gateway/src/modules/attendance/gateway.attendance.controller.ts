import { Body, Controller, Post } from '@nestjs/common';
import { GatewayAttendanceService } from './gateway.attendance.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.guard.decorator';
import { Roles } from '../auth/decorator/roles.guard.decorator';
import { AuthMicroService } from '@app/repo';
import { JwtPayload } from '../../types/jwt.payload';
import { User } from '../auth/decorator/user.decorator';
import { CheckAttendanceRequest, CheckAttendanceResponse } from './dto/check.attendance.dto';

@Controller('attendance')
@ApiTags('Attendance')
@ApiBearerAuth()
export class GatewayAttendanceController {
    constructor(private readonly attendanceService: GatewayAttendanceService) {}

    @Post('check')
    @Auth()
    @Roles([AuthMicroService.UserRole.USER])
    @ApiOperation({ summary: '[USER] 출석 체크' })
    @ApiResponse({ status: 201, description: '출석 체크 성공', type: CheckAttendanceResponse })
    async checkAttendance(
        @Body() body: CheckAttendanceRequest,
        @User() user: JwtPayload,
    ): Promise<CheckAttendanceResponse> {
        return this.attendanceService.checkAttendance(body, user.sub);
    }
}
