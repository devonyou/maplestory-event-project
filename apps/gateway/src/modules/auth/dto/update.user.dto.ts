import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserRequest extends PickType(UserDto, ['email', 'role'] as const) {}

export class UpdateUserResponse extends PickType(UserDto, ['email', 'role'] as const) {}
