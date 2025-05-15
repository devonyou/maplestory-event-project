import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './document/user.document';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import validationSchema from './common/config/validation.schema';

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

        MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        mongoose.set('debug', this.configService.get<string>('NODE_ENV') !== 'production');
    }
}
