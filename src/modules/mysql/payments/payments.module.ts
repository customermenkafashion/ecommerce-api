import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeModule } from './stripe/stripe.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { CartModule } from '../cart/cart.module';
import { OrdersModule } from '../orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../mysql/transactions/entities/transaction.entity';
import { OrderItem }  from '../../mysql/order-items/entities/order-item.entity';
import { Cart }  from '../../mysql/cart/entities/cart.entity';

import { OrderItemsModule } from '../../mysql/order-items/order-items.module';
import { OrderItemsService }           from '../../mysql/order-items/order-items.service';
import { OrderItemRepository }           from '../../mysql/order-items/order-item.repository';

import { TransactionsModule }   from '../../mysql/transactions/transactions.module';
import { TransactionsService }          from '../../mysql/transactions/transactions.service';
import { TransactionsRepository }           from '../../mysql/transactions/transactions.repository';

@Module({
  imports: [
    ConfigModule,
    StripeModule,
    RazorpayModule,
    CartModule,
    OrdersModule,
    OrderItemsModule,
    TransactionsModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, OrderItemsService, OrderItemRepository,TransactionsRepository],
  exports: [OrderItemsService, OrderItemRepository,TransactionsRepository], // ✅ export service for other modules

})
export class PaymentsModule {}
