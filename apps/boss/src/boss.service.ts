import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BossClearDocument } from './document/boss.clear.document';
import { BossMicroService } from '@app/repo';
import { GrpcAlreadyExistsException } from 'nestjs-grpc-exceptions';
import { EventBossTypeToString } from '@app/repo/types/boss';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class BossService {
    constructor(
        @InjectModel(BossClearDocument.name)
        private readonly bossClearModel: Model<BossClearDocument>,
    ) {}

    async clearBoss(dto: BossMicroService.ClearBossRequest): Promise<BossMicroService.ClearBossResponse> {
        const { userId, clearDate, bossId } = dto;
        const bossClear = await this.bossClearModel.findOne({ userId, clearDate, bossId }).exec();
        if (bossClear) {
            throw new GrpcAlreadyExistsException(
                `${clearDate}에 이미 ${EventBossTypeToString[bossId]}를 처리했습니다.`,
            );
        }
        await this.bossClearModel.create({ userId, clearDate, bossId });
        return { isCleared: true };
    }

    async findBossClear(
        request: BossMicroService.FindBossClearRequest,
    ): Promise<BossMicroService.FindBossClearResponse> {
        const { userId, startDate, endDate, bossId } = request;
        const start = startOfDay(new Date(startDate));
        const end = endOfDay(new Date(endDate));

        const bossClear = await this.bossClearModel
            .find({ userId, clearDate: { $gte: start, $lte: end }, bossId })
            .exec();

        return { isCleared: !!bossClear.length };
    }
}
