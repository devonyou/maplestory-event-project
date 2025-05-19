import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthMicroService } from '@app/repo';

export class UserDto implements AuthMicroService.User {
    @IsEmail({}, { message: '이메일이 올바르지 않습니다.' })
    @ApiProperty({ description: '이메일', type: String, example: 'admin@nexon.com' })
    email: string;

    @ApiHideProperty()
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    @MaxLength(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
    password?: string;

    @ApiProperty({
        description: '권한',
        type: Number,
        example: 'ADMIN',
        enum: AuthMicroService.UserRole,
    })
    @IsEnum(AuthMicroService.UserRole, { message: `올바른 권한 값이 아닙니다. [USER, OPERATOR, AUDITOR, ADMIN]` })
    role: AuthMicroService.UserRole;

    @ApiProperty({ description: '생성일', type: String, example: '2025-05-01' })
    createdAt: string;

    @ApiProperty({ description: '수정일', type: String, example: '2025-05-01' })
    updatedAt: string;
}
