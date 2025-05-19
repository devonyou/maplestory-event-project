import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

export const rabbitmqClients: ClientsProviderAsyncOptions[] = [
    {
        inject: [ConfigService],
        name: 'EVENT_PARTICIPATE_SERVICE',
        useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
                urls: [configService.get<string>('RABBITMQ_URL')],
                queue: 'event-participate-queue',
                queueOptions: {
                    durable: true,
                },
                prefetchCount: 1,
            },
        }),
    },
];
