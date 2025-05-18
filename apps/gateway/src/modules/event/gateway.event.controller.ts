import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GatewayEventService } from './gateway.event.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.guard.decorator';
import { Roles } from '../auth/decorator/roles.guard.decorator';
import { FindEventListResponse, FindEventResponse } from './dto/find.event.dto';
import { CreateEventRequest, CreateEventResponse } from './dto/create.event.dto';
import { AuthMicroService, EventMicroService } from '@app/repo';
import { CreateEventRewardRequest, CreateEventRewardResponse } from './dto/create.event.reward.dto';
import { ParticipateEventRequest, ParticipateEventResponse } from './dto/participate.dto';
import { User } from '../auth/decorator/user.decorator';
import { JwtPayload } from '../../types/jwt.payload';

@Controller('event')
@ApiTags('Event')
export class GatewayEventController {
    constructor(private readonly gatewayEventService: GatewayEventService) {}

    @Get('')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiOperation({ summary: '[ADMIN, OPERATOR] 이벤트 리스트 조회' })
    @ApiResponse({ status: 200, description: '[ADMIN, OPERATOR] 이벤트 리스트 조회', type: FindEventListResponse })
    async findEventList() {
        return this.gatewayEventService.findEventList();
    }

    @Get(':id')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiOperation({ summary: '[ADMIN, OPERATOR] 이벤트 조회' })
    @ApiResponse({ status: 200, description: '[ADMIN, OPERATOR] 이벤트 조회', type: FindEventResponse })
    async findEventById(@Param('id') id: string) {
        return this.gatewayEventService.findEventById(id);
    }

    @Post('')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiOperation({ summary: '[ADMIN, OPERATOR] 이벤트 생성' })
    @ApiResponse({ status: 201, description: '[ADMIN, OPERATOR] 이벤트 생성', type: CreateEventResponse })
    async createEvent(@Body() body: CreateEventRequest) {
        return this.gatewayEventService.createEvent(body);
    }

    @Post(':id/reward')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiOperation({ summary: '[ADMIN, OPERATOR] 이벤트 보상 생성' })
    @ApiResponse({ status: 201, description: '[ADMIN, OPERATOR] 이벤트 보상 생성', type: CreateEventRewardResponse })
    async createEventReward(@Param('id') eventId: string, @Body() body: CreateEventRewardRequest) {
        return this.gatewayEventService.createEventReward(eventId, body);
    }

    @Post(':id/participate')
    @Auth()
    @Roles([AuthMicroService.UserRole.USER])
    @ApiOperation({ summary: '[USER] 이벤트 참여(보상 요청)' })
    @ApiResponse({ status: 201, description: '[USER] 이벤트 참여(보상 요청)', type: ParticipateEventResponse })
    async participateEvent(
        @Param('id') eventId: string,
        @Body() body: ParticipateEventRequest,
        @User() user: JwtPayload,
    ) {
        const result = await this.gatewayEventService.participateEvent(eventId, user.sub, body);
        if (result.status === EventMicroService.EventParticipateStatus.REJECTED) {
            return {
                status: 'REJECTED',
                message: result.message,
            };
        } else {
            return {
                status: 'SUCCESS',
                message: result.message,
            };
        }
    }
}
