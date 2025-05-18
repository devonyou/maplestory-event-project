import { Reflector } from '@nestjs/core';
import { AuthMicroService } from '@app/repo';

export const Roles = Reflector.createDecorator<AuthMicroService.UserRole[]>();
