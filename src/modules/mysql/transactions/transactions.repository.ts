// src/transactions/transactions.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }
  

  // Optional: custom queries
  async findByPaymentIntent(paymentIntentId: string) {
    return this.findOne({
      where: { paymentIntentId },
      relations: ['order'],
    });
  }

  async findByOrderId(orderId: number) {
    return this.find({
      where: { order: { id: orderId } },
    });
  }
}
