import { AttendanceMicroService, AuthMicroService, BossMicroService, EventMicroService } from '@app/repo';
import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClients: ClientsProviderAsyncOptions[] = [
    {
        name: AuthMicroService.AUTH_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
                package: AuthMicroService.protobufPackage,
                url: `${configService.get<string>('AUTH_GRPC_HOST')}:${configService.get<number>('AUTH_GRPC_PORT')}`,
                protoPath: join(process.cwd(), 'proto', 'auth.proto'),
            },
        }),
    },
    {
        name: EventMicroService.EVENT_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
                package: EventMicroService.protobufPackage,
                url: `${configService.get<string>('EVENT_GRPC_HOST')}:${configService.get<number>('EVENT_GRPC_PORT')}`,
                protoPath: join(process.cwd(), 'proto', 'event.proto'),
            },
        }),
    },
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
