import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SigninRequest extends PickType(UserDto, ['email', 'password'] as const) {}

export class SigninResponse {
    @ApiProperty({ description: '액세스 토큰', type: String, example: 'token' })
    accessToken: string;

    @ApiProperty({ description: '리프레시 토큰', type: String, example: 'token' })
    refreshToken: string;
}
