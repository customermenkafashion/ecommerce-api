import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../events/entities/event.schema';

export type CommentDocument = Comment &
  Document & {
    replies?: CommentDocument[];
  };


@Schema({
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true },
})
export class Comment {
  @Prop({ required: true })
  text: string; // actual comment content
  
   // ✅ MySQL user ID reference
  @Prop({ required: true })
  userId: number;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  parentId?: Types.ObjectId; // optional


  @Prop({ default: true })
  isActive: boolean; // soft delete

  // @Prop({ type: [Types.ObjectId], ref: 'Comment' })
  // replies?: Types.ObjectId[]; // optional array of reply comment IDs

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
  justOne: false,
});

