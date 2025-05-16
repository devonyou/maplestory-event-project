import { CreateEventRequest } from '@app/repo/grpc/proto/event';
import { Injectable } from '@nestjs/common';
import { EventDocument } from './document/event.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventService {
    constructor(@InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>) {}

    async createEvent(dto: CreateEventRequest): Promise<EventDocument> {
        return await this.eventModel.create(dto);
    }
}
