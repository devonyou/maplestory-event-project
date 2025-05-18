import { EventMicroService } from '@app/repo';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { EventDocument } from './event.document';

@Schema({
    collection: 'event_participate',
    timestamps: true,
})
export class EventParticipateDocument extends Document<ObjectId> {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
    eventId: ObjectId;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, enum: EventMicroService.EventRewardType })
    rewardType: EventMicroService.EventRewardType;

    @Prop()
    amount: number;

    @Prop({ required: true, enum: EventMicroService.EventParticipateStatus })
    status: EventMicroService.EventParticipateStatus;

    @Prop()
    rejectedReason: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const EventParticipateSchema = SchemaFactory.createForClass(EventParticipateDocument);

EventParticipateSchema.virtual('event', {
    ref: EventDocument.name,
    localField: 'eventId',
    foreignField: '_id',
    justOne: true,
});

EventParticipateSchema.set('toObject', { virtuals: true });
EventParticipateSchema.set('toJSON', { virtuals: true });
