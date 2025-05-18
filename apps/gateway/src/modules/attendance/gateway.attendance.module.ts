import { Module } from '@nestjs/common';
import { GatewayAttendanceController } from './gateway.attendance.controller';
import { GatewayAttendanceService } from './gateway.attendance.service';

@Module({
    imports: [],
    controllers: [GatewayAttendanceController],
    providers: [GatewayAttendanceService],
})
export class GatewayAttendanceModule {}
