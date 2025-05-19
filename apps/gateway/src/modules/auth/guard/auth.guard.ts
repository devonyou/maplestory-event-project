import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GatewayAuthService } from '../gateway.auth.service';
import { Reflector } from '@nestjs/core';
import { Auth as AuthDecorator } from '../decorator/auth.guard.decorator';
import { JwtPayload } from '../../../types/jwt.payload';
import { AuthMicroService } from '@app/repo';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: GatewayAuthService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authDecorator = this.reflector.get<{ isRefresh: boolean }>(AuthDecorator, context.getHandler());
        if (authDecorator === undefined) return true;

        const request = context.switchToHttp().getRequest();
        const rawToken = request?.headers['authorization'];

        if (!rawToken) throw new UnauthorizedException();

        const [bearer, jwtToken] = rawToken.split(' ');
        if (bearer.toLowerCase() !== 'bearer' || !jwtToken) {
            throw new UnauthorizedException();
        }

        const isRefresh = authDecorator.isRefresh ?? false;

        const resp = await this.authService.verifyToken(jwtToken, isRefresh);
        if (!resp.verify) throw new UnauthorizedException();

        (request.user as JwtPayload) = {
            sub: resp.payload.sub,
            type: isRefresh ? 'refresh' : 'access',
            role: resp.payload.role as AuthMicroService.UserRole,
            tokenVersion: resp.payload.tokenVersion,
            email: resp.payload.email,
        };

        return true;
    }
}
