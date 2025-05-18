import { Module, OnModuleInit } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceDocument, AttendanceDocumentSchema } from './document/attendance.document';
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

        MongooseModule.forFeature([{ name: AttendanceDocument.name, schema: AttendanceDocumentSchema }]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        mongoose.set('debug', this.configService.get<string>('NODE_ENV') !== 'production');
    }
}
