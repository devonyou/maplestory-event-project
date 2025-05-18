import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, Document } from 'mongoose';
import { EventMicroService } from '@app/repo';

@Schema({ timestamps: true })
export class EventRewardDocument extends Document<ObjectId> {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
    eventId: ObjectId;

    @Prop({ enum: EventMicroService.EventRewardType, required: true })
    type: EventMicroService.EventRewardType;

    @Prop({ required: true })
    amount: number;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventRewardDocument);
