import { Controller } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceMicroService } from '@app/repo';

@Controller()
@AttendanceMicroService.AttendanceServiceControllerMethods()
export class AttendanceController implements AttendanceMicroService.AttendanceServiceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    checkAttendance(
        request: AttendanceMicroService.CheckAttendanceRequest,
    ): Promise<AttendanceMicroService.CheckAttendanceResponse> {
        return this.attendanceService.checkAttendance(request);
    }

    findAttendance(
        request: AttendanceMicroService.FindAttendanceRequest,
    ): Promise<AttendanceMicroService.FindAttendanceResponse> {
        return this.attendanceService.findAttendance(request);
    }
}
