import { UserRole } from './user.role';

export interface JwtPayload {
    sub: string;
    type: string;
    email: string;
    role: UserRole;
    tokenVersion: number;
}
