// import { Injectable, NotFoundException } from '@nestjs/common';
// import { DataSource, Repository, Like, EntityRepository } from 'typeorm';
// import { OrderItem } from './entities/order-item.entity';
// import { CreateOrderItemDto } from './dto/create-order-item.dto';
// import { Order } from '../orders/entities/order.entity';
// import { Product } from '../products/entities/product.entity';
// import { ProductVariant } from '../products/entities/product-variant.entity';

// @Injectable()
// @EntityRepository(OrderItem)
// export class OrderItemRepository extends Repository<OrderItem> {
//   constructor(
//     private dataSource: DataSource,
//     private readonly orderRepo: Repository<Order>,
//     private readonly productRepo: Repository<Product>,
//     private readonly variantRepo: Repository<ProductVariant>,
//   ) {
//     super(Order, dataSource.createEntityManager());
//   }

//   async createOrderItem(
//     dto: CreateOrderItemDto,
//     userId: number
//   ): Promise<OrderItem> {
//     const { orderId, productId, variantId, quantity, price } = dto;

//     // ✅ Validate order
//     const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
//     if (!order) throw new NotFoundException('Order not found');

//     // ✅ Validate product
//     const product = await this.productRepo.findOne({ where: { id: productId } });
//     if (!product) throw new NotFoundException('Product not found');

//     // ✅ Validate variant (every product has at least one variant)
//     const variant = await this.variantRepo.findOne({ where: { id: variantId } });
//     if (!variant) throw new NotFoundException('Variant not found');

//     const total = quantity * price;

//     const orderItem = this.create({
//       order,
//       product,
//       variant,
//       quantity,
//       price,
//       total,
//     });

//     return this.save(orderItem);
//   }

//   async findAllWithPagination(page = 1, limit = 10, search?: string) {
//     const qb = this.createQueryBuilder('oi')
//       .leftJoinAndSelect('oi.product', 'product')
//       .leftJoinAndSelect('oi.order', 'order')
//       .leftJoinAndSelect('oi.variant', 'variant')
//       .skip((page - 1) * limit)
//       .take(limit);

//     if (search) {
//       qb.andWhere('product.name LIKE :search', { search: `%${search}%` });
//     }

//     const [data, total] = await qb.getManyAndCount();

//     return {
//       data,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   async findOneById(id: number): Promise<OrderItem> {
//     const item = await this.findOne({
//       where: { id },
//       relations: ['order', 'product', 'variant'],
//     });
//     if (!item) throw new NotFoundException('OrderItem not found');
//     return item;
//   }
// }




import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  private orderRepo: Repository<Order>;
  private productRepo: Repository<Product>;
  private variantRepo: Repository<ProductVariant>;

  constructor(private dataSource: DataSource) {
    super(OrderItem, dataSource.createEntityManager());

    // ✅ Initialize dependent repositories here
    this.orderRepo = this.dataSource.getRepository(Order);
    this.productRepo = this.dataSource.getRepository(Product);
    this.variantRepo = this.dataSource.getRepository(ProductVariant);
  }

  async createOrderItem(dto: CreateOrderItemDto, userId: number): Promise<OrderItem> {
    const { orderId, productId, variantId, quantity, price } = dto;

    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Order not found');

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const total = quantity * price;

    const orderItem = this.create({ order, product, variant, quantity, price, total });
    return this.save(orderItem);
  }

  async findAllWithPagination(page = 1, limit = 10, search?: string) {
    const qb = this.createQueryBuilder('oi')
      .leftJoinAndSelect('oi.product', 'product')
      .leftJoinAndSelect('oi.order', 'order')
      .leftJoinAndSelect('oi.variant', 'variant')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneById(id: number): Promise<OrderItem> {
    const item = await this.findOne({ where: { id }, relations: ['order', 'product', 'variant'] });
    if (!item) throw new NotFoundException('OrderItem not found');
    return item;
  }

  async test(id: number): Promise<OrderItem> {
    const item = await this.findOne({ where: { id }, relations: ['order', 'product', 'variant'] });
    if (!item) throw new NotFoundException('OrderItem not found');
    return item;
  }


}
