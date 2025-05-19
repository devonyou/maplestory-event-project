import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventWorkerService } from './event.worker.service';
import { EventWorkerController } from './event.worker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDocument, EventSchema } from '../../document/event.document';
import { EventParticipateDocument, EventParticipateSchema } from '../../document/event.participate.document';
import { EventRewardDocument, EventRewardSchema } from '../../document/event.reward.document';

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                config: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),

        MongooseModule.forFeature([
            { name: EventDocument.name, schema: EventSchema },
            { name: EventRewardDocument.name, schema: EventRewardSchema },
            { name: EventParticipateDocument.name, schema: EventParticipateSchema },
        ]),
    ],
    controllers: [EventWorkerController],
    providers: [EventWorkerService],
})
export class EventWorkerModule {}
