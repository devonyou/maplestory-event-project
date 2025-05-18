import { Module } from '@nestjs/common';
import { GatewayBossController } from './gateway.boss.controller';
import { GatewayBossService } from './gateway.boss.service';

@Module({
    imports: [],
    controllers: [GatewayBossController],
    providers: [GatewayBossService],
})
export class GatewayBossModule {}
