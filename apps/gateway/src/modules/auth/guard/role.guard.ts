import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.guard.decorator';
import { Request } from 'express';
import { AuthMicroService } from '@app/repo';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<AuthMicroService.UserRole[]>(Roles, context.getHandler());
        if (roles === undefined || roles.length === 0) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        if (!user) return false;

        const userRole = user.role;
        if (roles.includes(userRole)) {
            return true;
        }

        throw new ForbiddenException('권한이 없습니다.');
    }
}
