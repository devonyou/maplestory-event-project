import { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventRewardDocument, EventRewardSchema } from './event.reward.document';
import { EventConditionDocument, EventConditionSchema } from './event.condition.document';

@Schema({ timestamps: true })
export class EventDocument extends Document<ObjectId> {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false, type: EventConditionSchema })
    eventCondition: EventConditionDocument;

    @Prop({ required: false, type: [EventRewardSchema] })
    eventRewardItems: EventRewardDocument[];

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true })
    isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
