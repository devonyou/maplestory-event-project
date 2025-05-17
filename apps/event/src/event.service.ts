import { EventMicroService } from '@app/repo';
import { Injectable } from '@nestjs/common';
import { EventDocument } from './document/event.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GrpcNotFoundException } from 'nestjs-grpc-exceptions';

@Injectable()
export class EventService {
    constructor(@InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>) {}

    async createEvent(dto: EventMicroService.CreateEventRequest): Promise<EventDocument> {
        return await this.eventModel.create(dto);
    }

    findEventList(dto: EventMicroService.FindEventListRequest) {
        const { status } = dto;
        const filter: FilterQuery<EventDocument> = {};
        const now = new Date();

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

    async findEventById(eventId: string) {
        try {
            const event = await this.eventModel.findById(eventId).exec();
            if (!event) {
                throw new GrpcNotFoundException('해당 ID의 이벤트가 존재하지 않습니다.');
            }
            return event;
        } catch (error) {
            throw new GrpcNotFoundException('해당 ID의 이벤트가 존재하지 않습니다.');
        }
    }
}
