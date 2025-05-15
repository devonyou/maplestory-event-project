import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClients } from './common/grpc/grpc.client';
import { GatewayAuthModule } from './modules/auth/gateway.auth.module';

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
    ],
    controllers: [],
    providers: [],
})
export class GatewayModule {}
