import { Module } from '@nestjs/common';
import { GatewayEventController } from './gateway.event.controller';
import { GatewayEventService } from './gateway.event.service';

@Module({
    imports: [],
    controllers: [GatewayEventController],
    providers: [GatewayEventService],
})
export class GatewayEventModule {}
