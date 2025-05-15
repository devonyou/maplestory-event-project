import { UserRole } from './user.role';

export interface JwtPayload {
    sub: string;
    type: string;
    role: UserRole;
}
