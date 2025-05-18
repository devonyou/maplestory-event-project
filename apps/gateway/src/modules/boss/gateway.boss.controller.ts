import { Body, Controller, Post } from '@nestjs/common';
import { GatewayBossService } from './gateway.boss.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClearBossRequest, ClearBossResponse } from './dto/clear.boss.dto';
import { Auth } from '../auth/decorator/auth.guard.decorator';
import { Roles } from '../auth/decorator/roles.guard.decorator';
import { AuthMicroService } from '@app/repo';
import { JwtPayload } from '../../types/jwt.payload';
import { User } from '../auth/decorator/user.decorator';

@Controller('boss')
@ApiTags('Boss')
export class GatewayBossController {
    constructor(private readonly bossService: GatewayBossService) {}

    @Post('clear')
    @Auth()
    @Roles([AuthMicroService.UserRole.USER])
    @ApiOperation({ summary: '[USER] 보스 처리' })
    @ApiResponse({ status: 201, description: '보스 처리 성공', type: ClearBossResponse })
    async clearBoss(@Body() body: ClearBossRequest, @User() user: JwtPayload): Promise<ClearBossResponse> {
        return this.bossService.clearBoss(body, user.sub);
    }
}
