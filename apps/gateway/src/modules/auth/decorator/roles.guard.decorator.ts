import { UserRole } from '@app/repo/grpc/proto/auth';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<UserRole[]>();
