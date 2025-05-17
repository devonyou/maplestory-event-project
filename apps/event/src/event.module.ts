import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDocument, EventSchema } from './document/event.document';
import { EventRewardDocument, EventRewardSchema } from './document/event.reward.document';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: validationSchema,
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URL'),
            }),
            inject: [ConfigService],
        }),

        MongooseModule.forFeature([
            { name: EventDocument.name, schema: EventSchema },
            { name: EventRewardDocument.name, schema: EventRewardSchema },
        ]),
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {}
