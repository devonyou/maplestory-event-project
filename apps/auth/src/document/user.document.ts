import { AuthMicroService } from '@app/repo';
import { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserDocument extends Document<ObjectId> {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: AuthMicroService.UserRole })
    role: AuthMicroService.UserRole;

    @Prop({ required: true, default: 0 })
    tokenVersion: number;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
