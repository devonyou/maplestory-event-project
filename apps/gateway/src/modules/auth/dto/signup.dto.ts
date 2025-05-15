import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../../types/user.role';

export class SignupRequest {
    @ApiProperty({ description: '이메일', type: String, example: 'admin@nexon.com' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    email: string;

    @ApiProperty({ description: '비밀번호', type: String, example: 'pass1234' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    @MaxLength(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
    password: string;

    @ApiProperty({ description: '권한', type: Number, example: UserRole.ADMIN, enum: UserRole })
    @IsEnum(UserRole, { message: `올바른 Role 값이 아닙니다. [0:USER, 1:OPERATOR, 2:AUDITOR, 3:ADMIN]` })
    role: UserRole;
}

export class SignupResponse {
    @ApiProperty({ description: '이메일', type: String, example: 'admin@nexon.com' })
    email: string;

    @ApiProperty({ description: '권한', type: Number, example: UserRole.ADMIN, enum: UserRole })
    role: UserRole;
}
