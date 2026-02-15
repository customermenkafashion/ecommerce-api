// src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Order]), // ✅ register both repositories
  ],
  providers: [TransactionsService],
  exports: [TransactionsService], // if used in other modules
})
export class TransactionsModule {}
