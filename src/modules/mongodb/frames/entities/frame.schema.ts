
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FrameDocument = Frame & Document;

export enum FrameType {
  VIDEO = 'video',
  IMAGE = 'image',
  PRODUCT = 'product',
}

@Schema({ timestamps: true })
export class Frame {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  // ✅ MySQL user ID reference
  @Prop({ required: true })
  userId: number;

  @Prop({ type: String, enum: FrameType, required: true })
  type: FrameType;

  @Prop({
    required: function (this: Frame) {
      return this.type !== FrameType.PRODUCT;
    },
  })
  contentUrl?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: function (this: Frame) {
      return this.type === FrameType.PRODUCT;
    },
  })
  productId?: Types.ObjectId;

  @Prop({ default: 0 })
  timestamp?: number;

  @Prop({ default: '' })
  description?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const FrameSchema = SchemaFactory.createForClass(Frame);
