import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@app/repo/grpc/proto/auth';

export class User {
    @ApiProperty({ description: '이메일', type: String, example: 'test@test.com' })
    email: string;

    @ApiProperty({ description: '권한', type: Number, example: 0, enum: UserRole })
    role: UserRole;
}

export class FindUsersRequest {}

export class FindUsersResponse {
    @ApiProperty({ description: '유저 목록', type: [User] })
    @IsArray()
    @Type(() => User)
    users: User[];
}
