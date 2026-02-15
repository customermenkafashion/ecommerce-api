import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './entities/activity-logs.schema';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog.name) private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  // Create a new log
  async create(log: Partial<ActivityLog>): Promise<ActivityLog> {
    const newLog = new this.activityLogModel(log);
    return newLog.save();
  }

  // Find all logs
  async findAll(): Promise<ActivityLog[]> {
    return this.activityLogModel.find().lean({ virtuals: true }).exec();
    }

    async findByUser(userId: number): Promise<ActivityLog[]> {
    return this.activityLogModel.find({ userId }).lean({ virtuals: true }).exec();
    }

  // Optional: delete all logs
  async deleteAll(): Promise<void> {
    await this.activityLogModel.deleteMany({});
  }
}
