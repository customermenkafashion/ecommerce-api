import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq'; // Using BullMQ for queues
import { DataSource } from 'typeorm';
import { Order } from '@modules/mysql/orders/entities/order.entity';

@Injectable()
export class OrderProcessingJob {
  private readonly logger = new Logger(OrderProcessingJob.name);

  constructor(private readonly dataSource: DataSource) {}

  async processOrder(orderId: number) {
    this.logger.log(`Starting processing for Order #${orderId}`);

    const orderRepo = this.dataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { id: orderId } });

    if (!order) {
      this.logger.error(`Order #${orderId} not found`);
      return;
    }

    // Example: Mark order as processed
    // order.status = 'processed';
    await orderRepo.save(order);

    this.logger.log(`Order #${orderId} processed successfully`);
  }
}
