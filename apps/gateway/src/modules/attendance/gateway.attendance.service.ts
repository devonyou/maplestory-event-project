import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AttendanceMicroService } from '@app/repo';
import { lastValueFrom } from 'rxjs';
import { CheckAttendanceRequest, CheckAttendanceResponse } from './dto/check.attendance.dto';

@Injectable()
export class GatewayAttendanceService {
    private attendanceService: AttendanceMicroService.AttendanceServiceClient;

    constructor(
        @Inject(AttendanceMicroService.ATTENDANCE_SERVICE_NAME)
        private readonly attendanceMicroService: ClientGrpc,
    ) {}

    onModuleInit() {
        this.attendanceService = this.attendanceMicroService.getService(AttendanceMicroService.ATTENDANCE_SERVICE_NAME);
    }

    async checkAttendance(dto: CheckAttendanceRequest, userId: string): Promise<CheckAttendanceResponse> {
        const stream = this.attendanceService.checkAttendance({ ...dto, userId });
        const result = await lastValueFrom(stream);
        return result;
    }
}
