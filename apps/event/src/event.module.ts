import { Module, OnModuleInit } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDocument, EventSchema } from './document/event.document';
import { EventRewardDocument, EventRewardSchema } from './document/event.reward.document';
import mongoose from 'mongoose';
import { ClientsModule } from '@nestjs/microservices';
import { EventParticipateDocument, EventParticipateSchema } from './document/event.participate.document';
import { grpcClients } from './common/grpc/grpc.client';

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
            { name: EventParticipateDocument.name, schema: EventParticipateSchema },
        ]),
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        mongoose.set('debug', this.configService.get<string>('NODE_ENV') !== 'production');
    }
}
