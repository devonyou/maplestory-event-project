import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninRequest {
    @ApiProperty({ description: '이메일', type: String, example: 'test@test.com' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    email: string;

    @ApiProperty({ description: '비밀번호', type: String, example: 'pass1234' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    password: string;
}

export class SigninResponse {
    @ApiProperty({ description: '액세스 토큰', type: String, example: 'token' })
    accessToken: string;

    @ApiProperty({ description: '리프레시 토큰', type: String, example: 'token' })
    refreshToken: string;
}
