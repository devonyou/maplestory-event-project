import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthMicroService } from '@app/repo';
import { ClientGrpc } from '@nestjs/microservices';
import { SignupRequest } from './dto/signup.dto';
import { lastValueFrom } from 'rxjs';
import { SigninRequest } from './dto/signin.dto';
import { UpdateUserRequest } from './dto/user.dto';
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
        const stream = this.authService.createUser(body);
        const result = await lastValueFrom(stream);
        return result;
    }

    async signin(body: SigninRequest) {
        const stream = this.authService.signinUser(body);
        const result = await lastValueFrom(stream);
        return result;
    }

    async findUsers() {
        const stream = this.authService.findUsers({});
        const result = await lastValueFrom(stream);
        return result;
    }

    async verifyToken(jwtToken: string, isRefresh: boolean) {
        const stream = this.authService.verifyToken({ jwtToken, isRefresh });
        const result = await lastValueFrom(stream);
        return result;
    }

    async updateUser(body: UpdateUserRequest) {
        const stream = this.authService.updateUser(body);
        const result = await lastValueFrom(stream);
        return result;
    }

    async refreshToken(user: JwtPayload) {
        const stream = this.authService.refreshToken({ userId: user.sub });
        const result = await lastValueFrom(stream);
        return result;
    }
}
