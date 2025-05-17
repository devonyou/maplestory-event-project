import { EventRewardType } from '@app/repo/grpc/proto/event';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, Document } from 'mongoose';

@Schema({ timestamps: true })
export class EventRewardDocument extends Document<ObjectId> {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
    eventId: ObjectId;

    @Prop({ enum: EventRewardType, required: true })
    type: EventRewardType;

    @Prop({ required: true })
    amount: number;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventRewardDocument);
