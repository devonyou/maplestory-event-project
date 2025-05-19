import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SigninRequest extends PickType(UserDto, ['email'] as const) {
    @ApiProperty({ description: '비밀번호', type: String, example: 'pass1234' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    @MaxLength(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
    password: string;
}

export class SigninResponse {
    @ApiProperty({ description: '액세스 토큰', type: String, example: 'token' })
    accessToken: string;

    @ApiProperty({ description: '리프레시 토큰', type: String, example: 'token' })
    refreshToken: string;
}
