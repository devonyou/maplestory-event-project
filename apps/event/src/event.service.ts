import { EventMicroService } from '@app/repo';
import { Injectable } from '@nestjs/common';
import { EventDocument } from './document/event.document';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GrpcAlreadyExistsException, GrpcNotFoundException } from 'nestjs-grpc-exceptions';
import { EventRewardDocument } from './document/event.reward.document';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>,
        @InjectModel(EventRewardDocument.name) private readonly eventRewardModel: Model<EventRewardDocument>,
    ) {}

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
            const event = await this.eventModel
                .findById(eventId)
                .populate<{ rewards: EventRewardDocument[] }>('rewards')
                .exec();
            if (!event) {
                throw new GrpcNotFoundException('해당 ID의 이벤트가 존재하지 않습니다.');
            }
            return event;
        } catch (error) {
            throw new GrpcNotFoundException('해당 ID의 이벤트가 존재하지 않습니다.');
        }
    }

    async createEventReward(request: EventMicroService.CreateEventRewardRequest) {
        const { eventId, eventReward } = request;
        const event = await this.findEventById(eventId);

        const reward = event.rewards.find(reward => reward.type === eventReward.type);
        if (reward) {
            throw new GrpcAlreadyExistsException('해당 이벤트에 이미 존재하는 보상입니다.');
        }

        return await this.eventRewardModel.create({
            eventId,
            type: eventReward.type,
            amount: eventReward.amount,
        });
    }
}
