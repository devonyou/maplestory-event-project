import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceDocument } from './document/attendance.document';
import { GrpcAlreadyExistsException } from 'nestjs-grpc-exceptions';
import { AttendanceMicroService } from '@app/repo';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel(AttendanceDocument.name)
        private readonly attendanceModel: Model<AttendanceDocument>,
    ) {}

    async checkAttendance(
        request: AttendanceMicroService.CheckAttendanceRequest,
    ): Promise<AttendanceMicroService.CheckAttendanceResponse> {
        const { userId, attendanceDate } = request;
        const attendance = await this.attendanceModel.findOne({ userId, attendanceDate });
        if (attendance) {
            throw new GrpcAlreadyExistsException(`${attendanceDate}에 이미 출석체크를 했습니다.`);
        }
        await this.attendanceModel.create({ userId, attendanceDate });
        return { isChecked: true };
    }

    async findAttendance(
        request: AttendanceMicroService.FindAttendanceRequest,
    ): Promise<AttendanceMicroService.FindAttendanceResponse> {
        const { userId, startDate, endDate } = request;
        const start = startOfDay(new Date(startDate));
        const end = endOfDay(new Date(endDate));

        const attendance = await this.attendanceModel.find({
            userId,
            attendanceDate: { $gte: start, $lte: end },
        });

        return { isChecked: !!attendance.length };
    }
}
