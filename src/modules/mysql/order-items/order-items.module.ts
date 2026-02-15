import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { OrderItemRepository } from './order-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderItem,
      Order,
      Product,
      ProductVariant,
    ]),
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemRepository],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}


