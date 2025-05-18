import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BossMicroService } from '@app/repo';
import { lastValueFrom } from 'rxjs';
import { ClearBossRequest, ClearBossResponse } from './dto/clear.boss.dto';

@Injectable()
export class GatewayBossService {
    private bossService: BossMicroService.BossServiceClient;

    constructor(
        @Inject(BossMicroService.BOSS_SERVICE_NAME)
        private readonly bossMicroService: ClientGrpc,
    ) {}

    onModuleInit() {
        this.bossService = this.bossMicroService.getService(BossMicroService.BOSS_SERVICE_NAME);
    }

    async clearBoss(dto: ClearBossRequest, userId: string): Promise<ClearBossResponse> {
        const stream = this.bossService.clearBoss({ ...dto, userId });
        const result = await lastValueFrom(stream);
        return result;
    }
}
