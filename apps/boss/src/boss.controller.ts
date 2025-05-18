import { Controller } from '@nestjs/common';
import { BossService } from './boss.service';
import { BossMicroService } from '@app/repo';

@Controller('boss')
@BossMicroService.BossServiceControllerMethods()
export class BossController implements BossMicroService.BossServiceController {
    constructor(private readonly bossService: BossService) {}

    clearBoss(request: BossMicroService.ClearBossRequest): Promise<BossMicroService.ClearBossResponse> {
        return this.bossService.clearBoss(request);
    }

    findBossClear(request: BossMicroService.FindBossClearRequest): Promise<BossMicroService.FindBossClearResponse> {
        return this.bossService.findBossClear(request);
    }
}
