// // likes/schemas/like.schema.ts

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type LikeDocument = Like & Document;


// @Schema({ timestamps: true })
// export class Like {

//   @Prop({ required: true })
//   userId: number; // MySQL user ID

//   @Prop({ type: Types.ObjectId, required: true })
//   targetId: Types.ObjectId; // videoId or commentId

//   @Prop({ required: true, enum: ['Video', 'Comment'] })
//   targetType: string;

//   @Prop({ default: true })
//   isLike: boolean;

//   @Prop()
//   createdAt?: Date;

//   @Prop()
//   updatedAt?: Date;
// }

// export const LikeSchema = SchemaFactory.createForClass(Like);

// LikeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LikeTargetType } from '../enums/like-target-type.enum';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true })
  userId: number; // MySQL user ID

  @Prop({ type: Types.ObjectId, required: true })
  targetId: Types.ObjectId;

  @Prop({
    required: true,
    enum: LikeTargetType,
  })
  targetType: LikeTargetType;

  @Prop({ default: true })
  isLike: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// ✅ One like per user per target
LikeSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true },
);

// ✅ Fast count queries
LikeSchema.index({ targetId: 1, targetType: 1, isLike: 1 });
