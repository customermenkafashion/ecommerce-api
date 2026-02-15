import { UseGuards,Req, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventReviewsService } from './event-reviews.service';
import { CreateEventReviewDto } from './dto/create-event-review.dto';
import { UpdateEventReviewDto } from './dto/update-event-review.dto';
import { EventReview, EventReviewsDocument } from './entities/event-review.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';
import { EventReviewResource } from './event-review.resource';

@Controller('event-reviews')
export class EventReviewsController {
  constructor(private readonly service: EventReviewsService) {}

 
  @Post()
    @UseGuards(AuthGuard('jwt'))   // 🔥 Protect route
    async create(
      @Body() createEventReviewDto: CreateEventReviewDto,
      @Req() req: any,
    ) {
      console.log("user", req.user);
  
      const userId = req.user.id; // from JWT payload
  
      const eventReview = await this.service.create({
        ...createEventReviewDto,
        userId,
      });
  
      const EventReviewResources = new EventReviewResource(eventReview);
      return {
         eventReviews: EventReviewResources,
       };
    }



  // Paginated + Search
  @Get()
  @UseGuards(AuthGuard('jwt'))   // 🔥 Protect route
  async findAll(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    // @Query('userId') userId?: number,
    @Query('eventId') eventId?: string,
  ) {
    page = Number(page);
    limit = Number(limit);
    const userId = req.user.id;
    const pagination: PaginationOptions = {
      page: Number(page),
      limit: Number(limit),
      search,
      userId,
      eventId,
    };

    const { data: events, total } = await this.service.findAll({
      page,
      limit,
      search,
      userId
    });

   const eventReviewResources = EventReviewResource.collection(events);
    return {
      eventReviews: eventReviewResources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),

    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventReviewsDocument> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventReviewDto): Promise<EventReviewsDocument> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
