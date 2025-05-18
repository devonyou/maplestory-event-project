import { BossMicroService } from '@app/repo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema({ collection: 'bossclear' })
export class BossClearDocument extends Document<ObjectId> {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, type: Date })
    clearDate: Date;

    @Prop({ required: true, enum: BossMicroService.EventBossType })
    bossId: BossMicroService.EventBossType;
}

export const BossClearDocumentSchema = SchemaFactory.createForClass(BossClearDocument);
