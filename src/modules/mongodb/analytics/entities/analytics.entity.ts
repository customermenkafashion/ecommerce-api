// src/modules/mongodb/analytics/entities/analytics.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

export enum AnalyticsAction {
  VIEW = 'view',
  CLICK = 'click',
  LIKE = 'like',
  REVIEW = 'review',
  SHARE = 'share',
  PURCHASE = 'purchase',
  CUSTOM = 'custom',
}

export type EntityType = 'Event' | 'Video' | 'Product' | 'Review' | 'Other';

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({ required: true, enum: AnalyticsAction })
  action: AnalyticsAction;

  @Prop({ type: Types.ObjectId, refPath: 'entityType', required: false })
  entityId?: Types.ObjectId;

  @Prop({ type: String, enum: ['Event','Video','Product','Review','Other'], required: false })
  entityType?: EntityType;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop({ type: Number, default: 1 })
  count?: number;

  @Prop({ type: String, required: false })
  sessionId?: string;

  @Prop({ type: String, required: false })
  ipAddress?: string;

  @Prop({ type: String, required: false })
  userAgent?: string;

  @Prop({ type: String, required: false })
  referrer?: string;

  @Prop({ type: Object, required: false })
  location?: {
    country?: string;
    region?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

// 🔹 Indexes for fast querying
AnalyticsSchema.index({ userId: 1, action: 1, entityId: 1 });
AnalyticsSchema.index({ entityType: 1, entityId: 1, action: 1 });
AnalyticsSchema.index({ sessionId: 1, action: 1 });
AnalyticsSchema.index({ createdAt: -1 }); // recent first
AnalyticsSchema.index({ action: 1, 'metadata.category': 1 }); // analytics filter example
