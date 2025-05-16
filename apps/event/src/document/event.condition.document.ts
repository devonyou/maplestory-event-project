import { EventConditionType } from '@app/repo/grpc/proto/event';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EventConditionDocument {
    @Prop({ enum: EventConditionType, required: true })
    type: EventConditionType;

    @Prop({ type: Object, required: true })
    payload: Record<string, any>;
}

export const EventConditionSchema = SchemaFactory.createForClass(EventConditionDocument);
