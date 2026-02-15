// activity-resource.ts
import { ActivityLog } from './entities/activity-logs.schema';

export class ActivityLogsResource {
  id: string;
  action: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  device?: string;
  browser?: string;
  location?: string;
  metadata?: Record<string, any>;
  isSuccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(activity: ActivityLog & { _id?: any }) {
    this.id = activity._id?.toString() || '';
    this.action = activity.action;
    this.userId = activity.userId;
    // this.userName = activity.userName;
    // this.userEmail = activity.userEmail;
    this.ipAddress = activity.ipAddress;
    this.device = activity.device;
    this.browser = activity.browser;
    this.location = activity.location;
    this.metadata = activity.metadata;
    // this.isSuccess = activity.isSuccess;
    this.createdAt = activity.createdAt;
    this.updatedAt = activity.updatedAt;
  }

  // Static helper to transform array of ActivityLogs
  static collection(activities: (ActivityLog & { _id?: any })[]) {
    return activities.map((activity) => new ActivityLogsResource(activity));
  }
}
