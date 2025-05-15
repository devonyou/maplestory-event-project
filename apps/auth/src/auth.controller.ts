import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMicroService } from '@app/repo';

@Controller()
@AuthMicroService.AuthServiceControllerMethods()
export class AuthController implements AuthMicroService.AuthServiceController {
    constructor(private readonly authService: AuthService) {}

    async createUser(request: AuthMicroService.CreateUserRequest): Promise<AuthMicroService.CreateUserResponse> {
        const result = await this.authService.createUser(request);
        return {
            email: result.email,
        };
    }
}
