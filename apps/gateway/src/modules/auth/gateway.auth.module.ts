import { Module } from '@nestjs/common';
import { GatewayAuthController } from './gateway.auth.controller';
import { GatewayAuthService } from './gateway.auth.service';

@Module({
    imports: [],
    controllers: [GatewayAuthController],
    providers: [GatewayAuthService],
})
export class GatewayAuthModule {}
