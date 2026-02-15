// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { OrderItem } from './entities/order-item.entity';
// import { CreateOrderItemDto } from './dto/create-order-item.dto';
// import { UpdateOrderItemDto } from './dto/update-order-item.dto';
// import { Order } from '../orders/entities/order.entity';
// import { Product } from '../products/entities/product.entity';
// import { ProductVariant } from '../products/entities/product-variant.entity';

// @Injectable()
// export class OrderItemsService {
//   constructor(
//     @InjectRepository(OrderItem)
//     private readonly OrderItemRepository: Repository<OrderItem>,

//     @InjectRepository(Order)
//     private readonly orderRepo: Repository<Order>,

//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,

//     @InjectRepository(ProductVariant)
//     private readonly variantRepo: Repository<ProductVariant>,
//   ) {}

//   // ✅ CREATE ORDER ITEM
//   async create( createOrderItemDto: CreateOrderItemDto, userId: number): Promise<OrderItem> {
//   // const { orderId, productId, variantId, quantity, price } =
//   //   createOrderItemDto;

//   // ✅ Validate Order
//   // const order = await this.orderRepo.findOne({
//   //   where: { id: orderId, userId },
//   // });
//   // if (!order) {
//   //   throw new NotFoundException('Order not found');
//   // }

//   // // ✅ Validate Product
//   // const product = await this.productRepo.findOne({
//   //   where: { id: productId },
//   // });
//   // if (!product) {
//   //   throw new NotFoundException('Product not found');
//   // }

//   // // ✅ Validate Variant (optional)
//   // let variant: ProductVariant | undefined;
//   // if (variantId) {
//   //   variant = await this.variantRepo.findOne({
//   //     where: { id: variantId },
//   //   });
//   //   if (!variant) {
//   //     throw new NotFoundException('Variant not found');
//   //   }
//   // }

//   const total = createOrderItemDto.quantity * createOrderItemDto.price;


//  const order = await this.orderRepo.findOne({ where: { id: createOrderItemDto.orderId } });
//   if (!order) throw new NotFoundException('Order not found');

//   const product = await this.productRepo.findOne({ where: { id: createOrderItemDto.productId } });
//   if (!product) throw new NotFoundException('Product not found');

//   let variant: ProductVariant | null = null;
//   if (createOrderItemDto.variantId) {
//     variant = await this.variantRepo.findOne({ where: { id: createOrderItemDto.variantId } });
//     if (!variant) throw new NotFoundException('Variant not found');
//   }

//   const orderItem = this.OrderItemRepository.create({
//     order,   // <-- assign full entity
//     product, // <-- assign full entity
//     variant, // <-- assign full entity or null
//     quantity: createOrderItemDto.quantity,
//     price: createOrderItemDto.price,
//     total: createOrderItemDto.quantity * createOrderItemDto.price,
//   });

//   return await this.OrderItemRepository.save(orderItem);



// }






//   // ✅ GET ALL (PAGINATION + SEARCH)
//   async findAll(page = 1, limit = 10, search?: string) {
//     const qb = this.OrderItemRepository
//       .createQueryBuilder('oi')
//       .leftJoinAndSelect('oi.product', 'product')
//       .leftJoinAndSelect('oi.order', 'order')
//       .skip((page - 1) * limit)
//       .take(limit);

//     if (search) {
//       qb.andWhere('product.name LIKE :search', {
//         search: `%${search}%`,
//       });
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

//   // ✅ GET SINGLE (USER SAFE)
//   async findOneByIdAndUserId(id: number, userId: number) {
//     const item = await this.OrderItemRepository.findOne({
//       where: { id },
//       relations: ['order', 'product', 'variant'],
//     });

//     if (!item) throw new NotFoundException('OrderItem not found');
//     return item;
//   }

//   // ✅ UPDATE
//   async update(id: number, dto: UpdateOrderItemDto) {
//     const item = await this.OrderItemRepository.findOne({ where: { id } });
//     if (!item) throw new NotFoundException('OrderItem not found');

//     const quantity = dto.quantity ?? item.quantity;
//     const price = dto.price ?? item.price;

//     Object.assign(item, dto, {
//       total: quantity * price,
//     });

//     return this.OrderItemRepository.save(item);
//   }

//   // ✅ DELETE
//   async remove(id: number, userId: number) {
//     const item = await this.OrderItemRepository.findOne({
//       where: { id },
//     });

//     if (!item) throw new NotFoundException('OrderItem not found');
//     await this.OrderItemRepository.delete(id);
//   }
// }







// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { OrderItem } from './entities/order-item.entity';
// import { CreateOrderItemDto } from './dto/create-order-item.dto';
// import { UpdateOrderItemDto } from './dto/update-order-item.dto';
// import { Order } from '../orders/entities/order.entity';
// import { Product } from '../products/entities/product.entity';
// import { ProductVariant } from '../products/entities/product-variant.entity';

// @Injectable()
// export class OrderItemsService {
//   constructor(
//     @InjectRepository(OrderItem)
//     private readonly OrderItemRepository: Repository<OrderItem>,

//     @InjectRepository(Order)
//     private readonly orderRepo: Repository<Order>,

//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,

//     @InjectRepository(ProductVariant)
//     private readonly variantRepo: Repository<ProductVariant>,
//   ) {}

//   // ✅ CREATE ORDER ITEM
//    async create(createOrderItemDto: CreateOrderItemDto, userId: number): Promise<OrderItem> {
//   const { orderId, productId, variantId, quantity, price } = createOrderItemDto;

//   const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
//   if (!order) throw new NotFoundException('Order not found');

//   const product = await this.productRepo.findOne({ where: { id: productId } });
//   if (!product) throw new NotFoundException('Product not found');

//   // Use undefined, not null
//  let variant: ProductVariant | undefined;
//   if (variantId) {
//     const foundVariant = await this.variantRepo.findOne({ where: { id: variantId } });
//     if (!foundVariant) throw new NotFoundException('Variant not found');
//     variant = foundVariant; // now TypeScript knows it's not null
//   }


//   const total = quantity * price;

//   const orderItem = this.OrderItemRepository.create({
//     order,       // relation object
//     product,     // relation object
//     variant,     // undefined if no variant
//     quantity,
//     price,
//     total,
//   });

//   return await this.OrderItemRepository.save(orderItem);
// }




//   // ✅ GET ALL (PAGINATION + SEARCH)
//   async findAll(page = 1, limit = 10, search?: string) {
//     const qb = this.OrderItemRepository
//       .createQueryBuilder('oi')
//       .leftJoinAndSelect('oi.product', 'product')
//       .leftJoinAndSelect('oi.order', 'order')
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

//   // ✅ GET SINGLE (USER SAFE)
//   async findOneByIdAndUserId(id: number, userId: number) {
//     const item = await this.OrderItemRepository.findOne({
//       where: { id },
//       relations: ['order', 'product', 'variant'],
//     });

//     if (!item) throw new NotFoundException('OrderItem not found');
//     return item;
//   }

//   // ✅ UPDATE
//   async update(id: number, dto: UpdateOrderItemDto) {
//     const item = await this.OrderItemRepository.findOne({ where: { id } });
//     if (!item) throw new NotFoundException('OrderItem not found');

//     const quantity = dto.quantity ?? item.quantity;
//     const price = dto.price ?? item.price;

//     Object.assign(item, dto, { total: quantity * price });

//     return this.OrderItemRepository.save(item);
//   }

//   // ✅ DELETE
//   async remove(id: number, userId: number) {
//     const item = await this.OrderItemRepository.findOne({ where: { id } });
//     if (!item) throw new NotFoundException('OrderItem not found');

//     await this.OrderItemRepository.delete(id);
//   }
// }



// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { OrderItemRepositorysitory } from './order-item.repository';
// import { CreateOrderItemDto } from './dto/create-order-item.dto';
// import { UpdateOrderItemDto } from './dto/update-order-item.dto';
// import { OrderItem } from './entities/order-item.entity';
// import { Order } from '../orders/entities/order.entity';
// import { Product } from '../products/entities/product.entity';
// import { ProductVariant } from '../products/entities/product-variant.entity';

// @Injectable()
// export class OrderItemsService {
//   constructor(
//     @InjectRepository(Order)
//     private readonly orderRepo: Repository<Order>,
//     @InjectRepository(Product)
//     private readonly productRepo: Repository<Product>,
//     @InjectRepository(ProductVariant)
//     private readonly variantRepo: Repository<ProductVariant>,

//     @InjectRepository(OrderItem)
//     private readonly OrderItemRepository: Repository<OrderItem>, // <-- this works

//   ) {}

//   // ✅ CREATE
//   async create(dto: CreateOrderItemDto, userId: number): Promise<OrderItem> {
//     return this.OrderItemRepository.createOrderItem(dto, userId);
//   }

//   // ✅ GET ALL
//   async findAll(page = 1, limit = 10, search?: string) {
//     return this.OrderItemRepository.findAllWithPagination(page, limit, search);
//   }

//   // ✅ GET SINGLE
//   async findOneByIdAndUserId(id: number,userId:number) {
//     return this.OrderItemRepository.findOneById(id);
//   }

//   // ✅ UPDATE
//   async update(id: number, dto: UpdateOrderItemDto) {
//     const item = await this.OrderItemRepository.findOneById(id);

//     item.quantity = dto.quantity ?? item.quantity;
//     item.price = dto.price ?? item.price;
//     item.total = item.quantity * item.price;

//     return this.OrderItemRepository.save(item);
//   }

//   // ✅ DELETE
//   async remove(id: number,userId:number) {
//     const item = await this.OrderItemRepository.findOneById(id);
//     return this.OrderItemRepository.remove(item);
//   }
// }



import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemRepository } from './order-item.repository';

@Injectable()
export class OrderItemsService {
  constructor(private readonly orderItemRepo: OrderItemRepository) {}

  async create(dto: CreateOrderItemDto, userId: number): Promise<OrderItem> {
    return this.orderItemRepo.createOrderItem(dto, userId);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.orderItemRepo.findAllWithPagination(page, limit, search);
  }

  async findOneByIdAndUserId(id: number,userId:number) {
    return this.orderItemRepo.findOneById(id);
  }

  async update(id: number, dto: UpdateOrderItemDto) {
    const item = await this.orderItemRepo.findOneById(id);
    item.quantity = dto.quantity ?? item.quantity;
    item.price = dto.price ?? item.price;
    item.total = item.quantity * item.price;
    return this.orderItemRepo.save(item);
  }

  async remove(id: number,userId:number) {
    const item = await this.orderItemRepo.findOneById(id);
    return this.orderItemRepo.remove(item);
  }
}
