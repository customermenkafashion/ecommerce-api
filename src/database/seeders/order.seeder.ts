// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from '../../app.module';
// // import { DataSource } from 'typeorm';
// // import { Order } from '../../modules/orders/entities/order.entity';
// // import { Product } from '../../modules/products/entities/product.entity';
// // import { User } from '../../modules/users/entities/user.entity';
// // import { ProductVariant } from '../../modules/products/entities/product-variant.entity';
// // import { OrderItemsService } from '../../modules/order-items/order-items.service';
// // import { OrdersService } from '../../modules/orders/orders.service';

// //   export async function OrderSeeder(dataSource: DataSource) {
// //     const orderRepo = dataSource.getRepository(Order);
// //     const userRepo = dataSource.getRepository(User);

// //     const users = await userRepo.find();

// //     for (let i = 0; i < 10; i++) {
// //       const subtotal = 1000;
// //       const tax = 100;
// //       const discount = 50;

// //       await orderRepo.save({
// //         user: users[Math.floor(Math.random() * users.length)],
// //         order_number: `ORD-${Date.now()}-${i}`,
// //         subtotal,
// //         tax,
// //         discount,
// //         total: subtotal + tax - discount,
// //         payment_method: 'COD',
// //         payment_status: 'success',
// //         status: 'delivered',
// //       });
// //     }
// //   }

// import { DataSource } from 'typeorm';
// import { OrdersService } from '../../modules/orders/orders.service';

// export async function OrderSeeder(
//   dataSource: DataSource,
//   ordersService: OrdersService,
// ) {
//   const users = await dataSource.query(`SELECT id FROM users LIMIT 5`);

//   for (let i = 0; i < users.length; i++) {
//     var subtotal = 100* (i+1);
//     var tax = 100* (i+1);
//     var discount = 100* (i+1);
//     await ordersService.create({
//       userId: users[i].id,
//       createOrderDto: {
//         user: users[Math.floor(Math.random() * users.length)],
//         order_number: `ORD-${Date.now()}-${i}`,
//         subtotal,
//         tax,
//         discount,
//         total: subtotal + tax - discount,
//         payment_method: 'COD',
//         payment_status: 'success',
//         status: 'delivered',
//       },
//     });
//   }

//   console.log('✅ Orders seeded');
// }



import { DataSource } from 'typeorm';
import { OrderItem } from '../../modules/mysql/order-items/entities/order-item.entity';
import { Product } from '../../modules/mysql/products/entities/product.entity';
import { ProductVariant } from '../../modules/mysql/products/entities/product-variant.entity';
import { OrdersService } from '../../modules/mysql/orders/orders.service';
import { OrderItemsService } from '../../modules/mysql/order-items/order-items.service';

export async function OrderSeeder(
  dataSource: DataSource,
  ordersService: OrdersService,
  orderItemsService: OrderItemsService,
) {
  const users = await dataSource.query(`SELECT id FROM users LIMIT 5`);
  const products = await dataSource.getRepository(Product).find({
    relations: ['variants'],
    take: 5,
  });

  for (let i = 0; i < users.length; i++) {
    const subtotal = 100 * (i + 1);
    const tax = 10 * (i + 1);
    const discount = 5 * (i + 1);

    // ✅ Create Order
    const order = await ordersService.create({
      userId: users[i].id,
      createOrderDto: {
        order_number: `ORD-${Date.now()}-${i}`,
        subtotal,
        tax,
        discount,
        total: subtotal + tax - discount,
        payment_method: 'COD',
        payment_status: 'success',
        status: 'delivered',
      },
    });

    // ✅ Create Order Items
    for (let j = 0; j < 2; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const variant =
        product.variants?.length > 0
          ? product.variants[Math.floor(Math.random() * product.variants.length)]
          : null;

      const quantity = j + 1;
      const price = 100 * quantity;

      await orderItemsService.create(
        {
          orderId: order.id,
          productId: product.id,
          variantId: variant?.id ?? undefined,
          quantity,
          price,
        },
        1 // userId
      );


    }
  }

  console.log('✅ Orders + Order Items seeded successfully');
}
