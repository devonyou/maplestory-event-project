import { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
    USER = 0,
    OPERATOR = 1,
    AUDITOR = 2,
    ADMIN = 3,
}

@Schema({ timestamps: true })
export class UserDocument extends Document<ObjectId> {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: UserRole })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
