import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

export enum ActivityStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING = 'pending',
}

export enum ActivityEntityType {
  EVENT = 'Event',
  VIDEO = 'Video',
  PRODUCT = 'Product',
  ORDER = 'Order',
  REVIEW = 'Review',
  USER = 'User',
  SYSTEM = 'System',
  OTHER = 'Other',
}

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: number;

  @Prop()
  device?: string;

  @Prop()
  browser?: string;

   @Prop()
  location?: string;

  @Prop({ type: String, required: false })
  sessionId?: string;

  @Prop({ required: true })
  action: string;

  @Prop({ type: String, enum: Object.values(ActivityEntityType), required: false })
  entityType?: ActivityEntityType;

  @Prop({ type: Types.ObjectId, refPath: 'entityType', required: false })
  entityId?: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(ActivityStatus), default: ActivityStatus.SUCCESS })
  status?: ActivityStatus;

  @Prop({ type: String })
  message?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: String })
  referrer?: string;

  @Prop({ type: Object })
  geoLocation?: {
    country?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };

  @Prop({ type: String })
  correlationId?: string;

  @Prop({ type: Object })
  error?: {
    code?: string;
    message?: string;
    stack?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  organizationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: false })
  projectId?: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;


}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Indexes
ActivityLogSchema.index({ userId: 1, action: 1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ correlationId: 1 });
ActivityLogSchema.index({ organizationId: 1, projectId: 1 });
