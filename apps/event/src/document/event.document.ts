import { Document, HydratedDocument, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventConditionDocument, EventConditionSchema } from './event.condition.document';
import { EventRewardDocument } from './event.reward.document';

@Schema({ timestamps: true })
export class EventDocument extends Document<ObjectId> {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false, type: EventConditionSchema })
    eventCondition: EventConditionDocument;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true })
    isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);

EventSchema.virtual('rewards', {
    ref: EventRewardDocument.name,
    localField: '_id',
    foreignField: 'eventId',
});

EventSchema.set('toObject', { virtuals: true });
EventSchema.set('toJSON', { virtuals: true });

export type EventWithRewards = HydratedDocument<EventDocument> & {
    rewards?: EventRewardDocument[];
};
