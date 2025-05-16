import { EventRewardType } from '@app/repo/grpc/proto/event';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EventRewardDocument {
    @Prop({ required: true, enum: EventRewardType })
    type: EventRewardType;

    @Prop({ required: true })
    amount: number;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventRewardDocument);
