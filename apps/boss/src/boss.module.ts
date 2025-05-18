import { Module, OnModuleInit } from '@nestjs/common';
import { BossController } from './boss.controller';
import { BossService } from './boss.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BossClearDocument, BossClearDocumentSchema } from './document/boss.clear.document';
import mongoose from 'mongoose';

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

        MongooseModule.forFeature([{ name: BossClearDocument.name, schema: BossClearDocumentSchema }]),
    ],
    controllers: [BossController],
    providers: [BossService],
})
export class BossModule implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        mongoose.set('debug', this.configService.get<string>('NODE_ENV') !== 'production');
    }
}
