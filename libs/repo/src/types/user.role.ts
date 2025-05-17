// export enum UserRole {
//     USER = 0,
//     OPERATOR = 1,
//     AUDITOR = 2,
//     ADMIN = 3,
// }

import { AuthMicroService } from '../grpc';

export const UserRoleToString = {
    [AuthMicroService.UserRole.USER]: 'USER',
    [AuthMicroService.UserRole.OPERATOR]: 'OPERATOR',
    [AuthMicroService.UserRole.AUDITOR]: 'AUDITOR',
    [AuthMicroService.UserRole.ADMIN]: 'ADMIN',
};

export const StringToUserRole = {
    USER: AuthMicroService.UserRole.USER,
    OPERATOR: AuthMicroService.UserRole.OPERATOR,
    AUDITOR: AuthMicroService.UserRole.AUDITOR,
    ADMIN: AuthMicroService.UserRole.ADMIN,
};
