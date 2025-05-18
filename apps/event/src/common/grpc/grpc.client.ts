import { AttendanceMicroService, BossMicroService } from '@app/repo';
import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClients: ClientsProviderAsyncOptions[] = [
    {
        name: BossMicroService.BOSS_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
                package: BossMicroService.protobufPackage,
                url: `${configService.get<string>('BOSS_GRPC_HOST')}:${configService.get<number>('BOSS_GRPC_PORT')}`,
                protoPath: join(process.cwd(), 'proto', 'boss.proto'),
            },
        }),
    },
    {
        name: AttendanceMicroService.ATTENDANCE_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
                package: AttendanceMicroService.protobufPackage,
                url: `${configService.get<string>('ATTENDANCE_GRPC_HOST')}:${configService.get<number>('ATTENDANCE_GRPC_PORT')}`,
                protoPath: join(process.cwd(), 'proto', 'attendance.proto'),
            },
        }),
    },
];
