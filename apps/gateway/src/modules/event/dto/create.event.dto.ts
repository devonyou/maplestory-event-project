import { EventDto } from './event.dto';
import { PickType } from '@nestjs/swagger';

export class CreateEventRequest extends PickType(EventDto, [
    'title',
    'eventCondition',
    'startDate',
    'endDate',
    'isActive',
] as const) {}

export class CreateEventResponse extends EventDto {}
