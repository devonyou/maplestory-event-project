import { EventMicroService } from '@app/repo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EventConditionDocument {
    @Prop({ enum: EventMicroService.EventConditionType, required: true })
    type: EventMicroService.EventConditionType;

    @Prop({ type: Object, required: true })
    payload: Record<string, any>;
}

export const EventConditionSchema = SchemaFactory.createForClass(EventConditionDocument);
