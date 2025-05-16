import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMicroService } from '@app/repo';

@Controller()
@AuthMicroService.AuthServiceControllerMethods()
export class AuthController implements AuthMicroService.AuthServiceController {
    constructor(private readonly authService: AuthService) {}

    async createUser(request: AuthMicroService.CreateUserRequest): Promise<AuthMicroService.CreateUserResponse> {
        const result = await this.authService.createUser(request);
        return result;
    }

    async signinUser(request: AuthMicroService.SigninUserRequest): Promise<AuthMicroService.SigninUserResponse> {
        const result = await this.authService.signinUser(request);
        return result;
    }

    async findUsers(request: AuthMicroService.FindUsersRequest): Promise<AuthMicroService.FindUsersResponse> {
        const result = await this.authService.findUsers(request);
        return {
            users: result.map(user => ({
                email: user.email,
                role: user.role,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            })),
        };
    }

    async verifyToken(request: AuthMicroService.VerifyTokenRequest): Promise<AuthMicroService.VerifyTokenResponse> {
        const result = await this.authService.verifyToken(request);
        return result;
    }

    updateUser(request: AuthMicroService.UpdateUserRequest): Promise<AuthMicroService.UpdateUserResponse> {
        return this.authService.updateUser(request);
    }

    refreshToken(request: AuthMicroService.RefreshTokenRequest): Promise<AuthMicroService.RefreshTokenResponse> {
        return this.authService.refreshToken(request);
    }
}
