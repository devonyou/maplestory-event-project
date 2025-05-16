import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { GatewayAuthService } from './gateway.auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { FindUsersResponse, UpdateUserRequest, UpdateUserResponse } from './dto/user.dto';
import { Auth } from './decorator/auth.guard.decorator';
import { Roles } from './decorator/roles.guard.decorator';
import { UserRole } from '../../types/user.role';
import { JwtPayload } from '../../types/jwt.payload';
import { User } from './decorator/user.decorator';

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

    @Patch('')
    @Auth({ isRefresh: false })
    @Roles([UserRole.ADMIN])
    @ApiResponse({ status: 200, description: '[ADMIN] 유저 정보(권한) 수정', type: UpdateUserResponse })
    updateUser(@Body() body: UpdateUserRequest): Promise<UpdateUserResponse> {
        return this.authService.updateUser(body);
    }

    @Post('refresh')
    @Auth({ isRefresh: true })
    @ApiResponse({ status: 201, description: '[전체] 토큰 갱신' })
    refreshToken(@User() user: JwtPayload): Promise<SigninResponse> {
        return this.authService.refreshToken(user);
    }
}
