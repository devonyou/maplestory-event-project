import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayAuthService } from './gateway.auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { FindUsersResponse } from './dto/user.dto';

@Controller('auth')
@ApiTags('auth')
export class GatewayAuthController {
    constructor(private readonly authService: GatewayAuthService) {}

    @Get('')
    @ApiResponse({ status: 200, description: '[전체] 유저 목록 조회', type: FindUsersResponse })
    findUsers(): Promise<FindUsersResponse> {
        return this.authService.findUsers();
    }

    @Post('signup')
    @ApiResponse({ status: 201, description: '[전체] 회원가입(유저등록)', type: SignupResponse })
    signup(@Body() body: SignupRequest): Promise<SignupResponse> {
        return this.authService.signup(body);
    }

    @Post('signin')
    @ApiResponse({ status: 201, description: '[전체] 로그인', type: SigninResponse })
    signin(@Body() body: SigninRequest): Promise<SigninResponse> {
        return this.authService.signin(body);
    }
}
