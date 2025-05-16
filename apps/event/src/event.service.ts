import { EventMicroService } from '@app/repo';
import { Injectable } from '@nestjs/common';
import { EventDocument } from './document/event.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class EventService {
    constructor(@InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>) {}

    async createEvent(dto: EventMicroService.CreateEventRequest): Promise<EventDocument> {
        return await this.eventModel.create(dto);
    }

    findEvents(dto: EventMicroService.FindEventsRequest) {
        const { isActive, status } = dto;
        const filter: FilterQuery<EventDocument> = {};
        const now = new Date();

        filter.isActive = isActive;

        if (status === EventMicroService.EventStatus.ACTIVE) {
            filter.startDate = { $lte: now };
            filter.endDate = { $gte: now };
        } else if (status === EventMicroService.EventStatus.INACTIVE) {
            filter.startDate = { $gt: now };
        } else if (status === EventMicroService.EventStatus.COMPLETED) {
            filter.endDate = { $lt: now };
        }

        return this.eventModel.find(filter).exec();
    }
}
