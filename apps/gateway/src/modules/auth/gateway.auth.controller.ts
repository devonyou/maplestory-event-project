import { Body, Controller, Post } from '@nestjs/common';
import { GatewayAuthService } from './gateway.auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupRequest, SignupResponse } from './dto/signup.dto';

@Controller('auth')
@ApiTags('auth')
export class GatewayAuthController {
    constructor(private readonly authService: GatewayAuthService) {}

    @Post('signup')
    @ApiResponse({ status: 201, description: '회원가입', type: SignupResponse })
    signup(@Body() body: SignupRequest): Promise<SignupResponse> {
        return this.authService.signup(body);
    }
}
