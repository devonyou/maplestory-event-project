import { NestFactory } from '@nestjs/core';
import { BossModule } from './boss.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(BossModule);
    const configService = app.get(ConfigService);
    const GRPC_HOST = configService.get<string>('GRPC_HOST');
    const GRPC_PORT = configService.get<number>('GRPC_PORT');

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            url: `${GRPC_HOST}:${GRPC_PORT}`,
            package: 'boss',
            protoPath: join(process.cwd(), 'proto', 'boss.proto'),
        },
    });

    await app.init();
    await app.startAllMicroservices();
}
bootstrap();
