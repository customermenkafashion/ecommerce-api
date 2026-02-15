import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLog } from './entities/activity-logs.schema';
import { ActivityLogsResource } from './activity-logs.resource';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  async create(@Body() log: Partial<ActivityLog>): Promise<ActivityLog> {
    return this.activityLogsService.create(log);
  }

  // @Get()
  // async findAll(): Promise<ActivityLog[]> {
  //   return this.activityLogsService.findAll();
  // }
  

  @Get()
  async findAll() {
    const activities = await this.activityLogsService.findAll();
    return {
      success: true,
      data: ActivityLogsResource.collection(activities),
    };
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number): Promise<ActivityLog[]> {
    return this.activityLogsService.findByUser(userId);
  }

  @Delete()
  async deleteAll(): Promise<{ message: string }> {
    await this.activityLogsService.deleteAll();
    return { message: 'All logs deleted' };
  }
}
