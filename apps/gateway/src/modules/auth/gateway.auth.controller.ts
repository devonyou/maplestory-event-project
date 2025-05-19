import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { GatewayAuthService } from './gateway.auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { SigninRequest, SigninResponse } from './dto/signin.dto';
import { Auth } from './decorator/auth.guard.decorator';
import { Roles } from './decorator/roles.guard.decorator';
import { JwtPayload } from '../../types/jwt.payload';
import { User } from './decorator/user.decorator';
import { FindUsersResponse } from './dto/find.user.dto';
import { UpdateUserRequest, UpdateUserResponse } from './dto/update.user.dto';
import { AuthMicroService } from '@app/repo';

@Controller('auth')
@ApiTags('Auth')
export class GatewayAuthController {
    constructor(private readonly authService: GatewayAuthService) {}

    @Get('')
    @ApiOperation({ summary: '[전체] 유저 목록 조회' })
    @ApiResponse({ status: 200, description: '[전체] 유저 목록 조회', type: FindUsersResponse })
    async findUserList(): Promise<FindUsersResponse> {
        const result = await this.authService.findUserList();
        return {
            users: result,
        };
    }

    @Post('signup')
    @ApiOperation({ summary: '[전체] 회원가입(유저등록)' })
    @ApiResponse({ status: 201, description: '[전체] 회원가입(유저등록)', type: SignupResponse })
    signup(@Body() body: SignupRequest): Promise<SignupResponse> {
        return this.authService.signup(body);
    }

    @Post('signin')
    @ApiOperation({ summary: '[전체] 로그인' })
    @ApiResponse({ status: 201, description: '[전체] 로그인', type: SigninResponse })
    signin(@Body() body: SigninRequest): Promise<SigninResponse> {
        return this.authService.signin(body);
    }

    @Patch('')
    @Auth()
    @ApiBearerAuth()
    @Roles([AuthMicroService.UserRole.ADMIN])
    @ApiOperation({ summary: '[ADMIN] 유저 정보(권한) 수정' })
    @ApiResponse({ status: 200, description: '[ADMIN] 유저 정보(권한) 수정', type: UpdateUserResponse })
    updateUser(@Body() body: UpdateUserRequest): Promise<UpdateUserResponse> {
        return this.authService.updateUser(body);
    }

    @Post('refresh')
    @Auth({ isRefresh: true })
    @ApiBearerAuth('refreshToken')
    @ApiOperation({ summary: '[전체] 토큰 갱신' })
    @ApiResponse({ status: 201, description: '[전체] 토큰 갱신', type: SigninResponse })
    refreshToken(@User() user: JwtPayload): Promise<SigninResponse> {
        return this.authService.refreshToken(user);
    }
}
