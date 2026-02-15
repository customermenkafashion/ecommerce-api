import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationService } from '@common/pagination/pagination.service';
import { OrdersRepository } from './orders.repository';
import { OrderResource } from './order.resource';



@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create({ createOrderDto, userId }: { createOrderDto: CreateOrderDto; userId: number }) {
    const order = this.ordersRepository.create({ ...createOrderDto, userId });
    const savedOrder = await this.ordersRepository.save(order);
    return new OrderResource(savedOrder);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const result = await this.ordersRepository.findOrders(page, limit, search);
    return {
      orders: result.data.map((o) => new OrderResource(o)),
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
    };
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product', 'orderItems.variant'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return new OrderResource(order);
  }

  async findOneByIdAndUserId(id: number, userId: number) {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
      relations: ['orderItems', 'orderItems.product', 'orderItems.variant'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return new OrderResource(order);
  }

  async update(orderId: number, updateOrderDto: Partial<UpdateOrderDto>) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);
    Object.assign(order, updateOrderDto);
    const updatedOrder = await this.ordersRepository.save(order);
    return new OrderResource(updatedOrder);
  }

  async remove(id: number, userId: number) {
    const result = await this.ordersRepository.delete({ id, userId });
    if (result.affected === 0) throw new NotFoundException('Order not found or no permission');
  }
}

