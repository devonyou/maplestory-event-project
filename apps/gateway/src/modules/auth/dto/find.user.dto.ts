import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FindUsersRequest {}

export class FindUsersResponse {
    @ApiProperty({ description: '유저 목록', type: [UserDto] })
    @IsArray()
    @Type(() => UserDto)
    @ValidateNested({ each: true })
    users: UserDto[];
}
