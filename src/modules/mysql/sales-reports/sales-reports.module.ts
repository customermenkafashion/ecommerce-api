import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesReportsService } from './sales-reports.service';
import { SalesReportsController } from './sales-reports.controller';
import { PaginationModule } from '@common/pagination/pagination.module';
import { SalesReport } from './entities/sales-report.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([
      SalesReport
    ]),
    PaginationModule,
  ],
  controllers: [SalesReportsController],
  providers: [SalesReportsService],
  exports: [SalesReportsService],
})
export class SalesReportsModule {}



