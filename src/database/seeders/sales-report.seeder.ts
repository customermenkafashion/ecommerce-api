// // import { Seeder } from 'typeorm-extension';
// import { DataSource } from 'typeorm';
// import { SalesReport } from '../../reports/sales-report.entity';

// export default class SalesReportSeeder implements Seeder {
//   async run(dataSource: DataSource): Promise<void> {
//     const repo = dataSource.getRepository(SalesReport);

//     await repo.save({
//       date: new Date().toISOString().split('T')[0],
//       total_orders: 10,
//       total_sales: 12000,
//       total_tax: 1000,
//       total_discount: 500,
//     });
//   }
// }



import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { SalesReport } from '../../modules/mysql/sales-reports/entities/sales-report.entity';


  export async function SalesReportSeeder(dataSource: DataSource) {
    const salesReportRepo = dataSource.getRepository(SalesReport);
    const users = await salesReportRepo.find();

    for (let i = 0; i < 10; i++) {
      const subtotal = 1000;
      const tax = 100;
      const discount = 50;

      await salesReportRepo.save({
        date: new Date().toISOString().split('T')[0],
        total_orders: 10,
        total_sales: 12000,
        total_tax: 1000,
        total_discount: 500,
      });
    }
  }

