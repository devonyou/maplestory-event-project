import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './common/config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './document/user.document';

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
    providers: [AuthService],
})
export class AuthModule {}
