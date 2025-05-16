import { Controller, Get } from '@nestjs/common';
import { GatewayEventService } from './gateway.event.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('event')
@ApiTags('Event')
export class GatewayEventController {
    constructor(private readonly gatewayEventService: GatewayEventService) {}

    @Get()
    async getEvents() {
        return this.gatewayEventService.getEvents();
    }
}
