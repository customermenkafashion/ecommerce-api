import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventReviewsDocument = EventReview & Document;
// export type EventReviewsPopulatedDocument = EventReviewsDocument & { name?: string };

@Schema({ timestamps: true })
export class EventReview {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  review: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const EventReviewSchema = SchemaFactory.createForClass(EventReview);

// Add compound unique index: a user can review an event only once
EventReviewSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true },
);
