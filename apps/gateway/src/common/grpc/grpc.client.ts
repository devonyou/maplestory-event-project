import { AuthMicroService } from '@app/repo';
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
];
