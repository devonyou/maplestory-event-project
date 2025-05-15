import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthMicroService } from '@app/repo';
import { ClientGrpc } from '@nestjs/microservices';
import { SignupRequest } from './dto/signup.dto';
import { lastValueFrom } from 'rxjs';

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
}
