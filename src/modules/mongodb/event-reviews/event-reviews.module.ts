import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventReviewsService } from './event-reviews.service';
import { EventReview, EventReviewSchema } from './entities/event-review.schema';
import { EventReviewsController } from './event-reviews.controller';
import { EventReviewsRepository } from './event-review.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventReview.name, schema: EventReviewSchema }]),
  ],
  controllers: [EventReviewsController],
  providers: [EventReviewsService, EventReviewsRepository],
  exports: [EventReviewsService, EventReviewsRepository],
})
export class EventReviewsModule {}
