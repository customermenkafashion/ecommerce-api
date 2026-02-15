// // src/transactions/transactions.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Transaction, TransactionStatus } from './entities/transaction.entity';
// import { Order } from '../orders/entities/order.entity';

// @Injectable()
// export class TransactionsService {
//   constructor(
//     @InjectRepository(Transaction)
//     private readonly transactionRepo: Repository<Transaction>,

//     @InjectRepository(Order)
//     private readonly orderRepo: Repository<Order>, // ✅ inject order repo
//   ) {}

//   async createTransaction(
//     order: Order, // use entity instead of id
//     amount: number,
//     currency: string,
//     gateway: string,
//     paymentIntentId?: string,
//   ): Promise<Transaction> {
//     const transaction = this.transactionRepo.create({
//       order, // pass full object
//       amount,
//       currency,
//       gateway,
//       paymentIntentId,
//       status: TransactionStatus.PENDING,
//     });

//     return this.transactionRepo.save(transaction);
//   }


//   async updateTransactionStatus(
//     paymentIntentId: string,
//     status: TransactionStatus,
//   ) {
//     const transaction = await this.transactionRepo.findOne({
//       where: { paymentIntentId },
//       relations: ['order'],
//     });

//     if (!transaction) throw new Error('Transaction not found');

//     transaction.status = status;
//     await this.transactionRepo.save(transaction);

//     // ✅ Update order status using repository
//     if (status === TransactionStatus.SUCCEEDED && transaction.order) {
//       transaction.order.status = 'paid';
//       await this.orderRepo.save(transaction.order); // use repository, not entity
//     }

//     return transaction;
//   }

//   async findByOrder(orderId: number) {
//     return this.transactionRepo.find({
//       where: { order: { id: orderId } },
//     });
//   }
// }




// src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>, // use standard repo

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createTransaction(
    order,
    amount: number,
    currency: string,
    gateway: string,
    paymentIntentId?: string,
    paymentData?: string,
  ): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      order,
      amount,
      currency,
      gateway,
      paymentIntentId,
      paymentData,
      status: TransactionStatus.PENDING,
    });

    return this.transactionRepo.save(transaction);
  }

  async updateTransactionStatus(
    paymentIntentId: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { paymentIntentId },
      relations: ['order'],
    });

    if (!transaction) throw new Error('Transaction not found');

    transaction.status = status;
    await this.transactionRepo.save(transaction);

    // Update order status using repository
    if (status === TransactionStatus.SUCCEEDED && transaction.order) {
      transaction.order.status = 'paid';
      await this.orderRepo.save(transaction.order);
    }

    return transaction;
  }

  async findByOrder(orderId: number) {
    return this.transactionRepo.find({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
  }
}
