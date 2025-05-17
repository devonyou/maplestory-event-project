import { AuthMicroService } from '@app/repo';

export interface JwtPayload {
    sub: string;
    type: string;
    email: string;
    role: AuthMicroService.UserRole;
    tokenVersion: number;
}
