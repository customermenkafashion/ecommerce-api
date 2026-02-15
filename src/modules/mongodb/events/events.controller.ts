import { UseGuards, Req, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResource } from './event.resource';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventsService.create(createEventDto);
    return  EventResource.collection(event);
  }



 @Get()
 @UseGuards(AuthGuard('jwt'))   // 🔥 Protect route
  async findAll(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    page = Number(page);
    limit = Number(limit);
    const userId = req.user.id;
    const { data: events, total } = await this.eventsService.findAll({
      page,
      limit,
      search,
      userId
    });

    const eventResources = EventResource.collection(events);

    return {
      events: eventResources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),

    };
  }



  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    return EventResource.collection(event);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventsService.update(id, updateEventDto);
    return EventResource.collection(event);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const event = await this.eventsService.remove(id);
    return EventResource.collection(event);
  }
}
