import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayEventService } from './gateway.event.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.guard.decorator';
import { Roles } from '../auth/decorator/roles.guard.decorator';
import { CreateEventRequest } from './dto/create.event.dto';
import { UserRole } from '@app/repo';
import { FindEventRequest, FindEventResponse } from './dto/find.event.dto';

@Controller('event')
@ApiTags('Event')
export class GatewayEventController {
    constructor(private readonly gatewayEventService: GatewayEventService) {}

    @Get()
    @Auth()
    @Roles([UserRole.ADMIN, UserRole.OPERATOR])
    @ApiResponse({ status: 200, description: '[ADMIN, OPERATOR] 이벤트 조회', type: FindEventResponse })
    async findEvents(@Body() body: FindEventRequest) {
        return this.gatewayEventService.findEvents(body);
    }

    @Post()
    @Auth()
    @Roles([UserRole.ADMIN, UserRole.OPERATOR])
    @ApiResponse({ status: 201, description: '[ADMIN, OPERATOR] 이벤트 생성', type: CreateEventRequest })
    async createEvent(@Body() body: CreateEventRequest) {
        return this.gatewayEventService.createEvent(body);
    }
}
