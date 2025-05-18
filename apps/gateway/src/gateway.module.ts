import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClients } from './common/grpc/grpc.client';
import { GatewayAuthModule } from './modules/auth/gateway.auth.module';
import { HttpLoggerMiddleware } from './common/logger/http.logger.middelware';
import { GatewayEventModule } from './modules/event/gateway.event.module';
import { GatewayBossModule } from './modules/boss/gateway.boss.module';
import { GatewayAttendanceModule } from './modules/attendance/gateway.attendance.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: validationSchema,
        }),

        ClientsModule.registerAsync({
            isGlobal: true,
            clients: [...grpcClients],
        }),

        GatewayAuthModule,
        GatewayEventModule,
        GatewayBossModule,
        GatewayAttendanceModule,
    ],
    controllers: [],
    providers: [],
})
export class GatewayModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    }
}
