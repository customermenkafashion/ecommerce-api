
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FrameDocument } from '../../frames/entities/frame.schema';
import { CommentDocument } from '../../comments/entities/comment.schema';

export type EventDocument = Event & Document;
export type EventPopulatedDocument = EventDocument & { frames: FrameDocument[], comments: CommentDocument[], likes_count?: number, likes?: any[] };

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop()
  duration?: number;

  @Prop()
  format?: string;

  // ✅ MySQL user ID reference
  @Prop({ required: true })
  userId: number;

  @Prop({ default: true })
  isActive: boolean;

  // Virtual field for comments
  // comments?: CommentDocument[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Virtual populate for frames
EventSchema.virtual('frames', {
  ref: 'Frame',
  localField: '_id',
  foreignField: 'eventId',
});

// Add virtual to populate comments
EventSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'eventId',
  justOne: false,
  match: { parentId: { $exists: false } }, // ✅ only main comments
});



// Virtual for likes count
EventSchema.virtual('likes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId', // Matches Like.targetId
  count: true,
  match: { targetType: 'Video' } // Only count likes for videos
});

EventSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
});
