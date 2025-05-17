import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GatewayEventService } from './gateway.event.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.guard.decorator';
import { Roles } from '../auth/decorator/roles.guard.decorator';
import { FindEventListResponse, FindEventResponse } from './dto/find.event.dto';
import { CreateEventRequest, CreateEventResponse } from './dto/create.event.dto';
import { AuthMicroService } from '@app/repo';

@Controller('event')
@ApiTags('Event')
export class GatewayEventController {
    constructor(private readonly gatewayEventService: GatewayEventService) {}

    @Get('')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiResponse({ status: 200, description: '[ADMIN, OPERATOR] 이벤트 리스트 조회', type: FindEventListResponse })
    async findEventList() {
        return this.gatewayEventService.findEventList();
    }

    @Get(':id')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiResponse({ status: 200, description: '[ADMIN, OPERATOR] 이벤트 조회', type: FindEventResponse })
    async findEventById(@Param('id') id: string) {
        return this.gatewayEventService.findEventById(id);
    }

    @Post('')
    @Auth()
    @Roles([AuthMicroService.UserRole.ADMIN, AuthMicroService.UserRole.OPERATOR])
    @ApiResponse({ status: 201, description: '[ADMIN, OPERATOR] 이벤트 생성', type: CreateEventResponse })
    async createEvent(@Body() body: CreateEventRequest) {
        return this.gatewayEventService.createEvent(body);
    }
}
