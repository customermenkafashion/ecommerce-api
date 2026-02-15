import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; // ✅ Import this
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository extends Repository<Order> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>, // ✅ add this,
  ) {
    super(Order, dataSource.createEntityManager());
  }

  async findOrders(page = 1, limit = 10, search?: string) {
    const take = limit;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { order_number: Like(`%${search}%`) },
          { status: Like(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.findAndCount({
      relations: ['orderItems', 'orderItems.product', 'orderItems.variant'],
      skip,
      take,
      where,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }
}
