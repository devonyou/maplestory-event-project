import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SignupRequest extends PickType(UserDto, ['email', 'password', 'role'] as const) {}

export class SignupResponse extends PickType(UserDto, ['email', 'role'] as const) {}
