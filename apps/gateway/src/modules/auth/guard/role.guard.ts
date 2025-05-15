import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../types/user.role';
import { Roles } from '../decorator/roles.guard.decorator';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
        if (roles === undefined || roles.length === 0) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        if (!user) return false;

        const userRole = user.role;
        return roles.includes(userRole);
    }
}
