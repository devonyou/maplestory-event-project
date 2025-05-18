import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema({ collection: 'attendance' })
export class AttendanceDocument extends Document<ObjectId> {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, type: Date })
    attendanceDate: Date;
}

export const AttendanceDocumentSchema = SchemaFactory.createForClass(AttendanceDocument);
