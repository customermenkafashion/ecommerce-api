import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssetDocument = Asset & Document;

@Schema({ timestamps: true })
export class Asset {
  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  videoId: Types.ObjectId; // links to Video model

  @Prop()
  thumbnail?: string; // preview image URL

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId?: Types.ObjectId; // optional product link

  @Prop({ type: Types.ObjectId, ref: 'ProductVariant' })
  variantId?: Types.ObjectId; // optional variant link

  @Prop({ type: [String] })
  tags?: string[]; // optional categories

  @Prop({ default: 0 })
  viewsCount?: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
