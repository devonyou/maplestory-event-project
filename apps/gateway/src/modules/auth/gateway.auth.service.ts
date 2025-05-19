import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthMicroService, UserRoleToString } from '@app/repo';
import { ClientGrpc } from '@nestjs/microservices';
import { SignupRequest } from './dto/signup.dto';
import { lastValueFrom } from 'rxjs';
import { SigninRequest } from './dto/signin.dto';
import { UpdateUserRequest } from './dto/update.user.dto';
import { JwtPayload } from '../../types/jwt.payload';

@Injectable()
export class GatewayAuthService implements OnModuleInit {
    private authService: AuthMicroService.AuthServiceClient;

    constructor(
        @Inject(AuthMicroService.AUTH_SERVICE_NAME)
        private readonly authMicroService: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authService = this.authMicroService.getService(AuthMicroService.AUTH_SERVICE_NAME);
    }

    async signup(body: SignupRequest) {
        const stream = this.authService.createUser({
            email: body.email,
            password: body.password,
            role: body.role,
        });
        const result = await lastValueFrom(stream);
        return {
            email: result.email,
            role: UserRoleToString[result.role],
        };
    }

    async signin(body: SigninRequest) {
        const stream = this.authService.signinUser({
            email: body.email,
            password: body.password,
        });
        const result = await lastValueFrom(stream);
        return result;
    }

    async findUserList() {
        const stream = this.authService.findUserList({});
        const result = await lastValueFrom(stream);
        return result.users?.map(user => ({
            ...user,
            role: UserRoleToString[user.role],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    async verifyToken(jwtToken: string, isRefresh: boolean) {
        const stream = this.authService.verifyToken({ jwtToken, isRefresh });
        const result = await lastValueFrom(stream);
        return result;
    }

    async updateUser(body: UpdateUserRequest) {
        const stream = this.authService.updateUser(body);
        const result = await lastValueFrom(stream);
        return {
            email: result.email,
            role: UserRoleToString[result.role],
        };
    }

    async refreshToken(user: JwtPayload) {
        const stream = this.authService.refreshToken({ userId: user.sub });
        const result = await lastValueFrom(stream);
        return result;
    }
}
