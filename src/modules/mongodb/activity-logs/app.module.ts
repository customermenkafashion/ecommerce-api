import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogsModule } from './activity-logs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/your-db-name'),
    ActivityLogsModule,
  ],
})
export class AppModule {}
