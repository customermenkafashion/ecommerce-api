import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/mysql/users/entities/user.entity';
import { Role } from '../modules/mysql/roles/entities/role.entity';
import { AddressesModule } from '../modules/mysql/addresses/addresses.module';
import { Permission } from '../modules/mysql/permissions/entities/permission.entity';
import { Product } from '../modules/mysql/products/entities/product.entity';
import { ProductVariant } from '../modules/mysql/products/entities/product-variant.entity';
import { ProductPrice } from '../modules/mysql/products/entities/product-price.entity';
import { Inventory } from '../modules/mysql/products/entities/inventory.entity';
import { VariantAttribute } from '../modules/mysql/products/entities/variant-attribute.entity';
import { ReviewsModule } from '../modules/mysql/reviews/reviews.module';
import { Order } from '../modules/mysql/orders/entities/order.entity';
import { OrderItem } from '../modules/mysql/order-items/entities/order-item.entity';
import { Transaction } from '../modules/mysql/transactions/entities/transaction.entity';
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any, // mysql
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User,Role,AddressesModule,Permission,Product, ProductVariant, ProductPrice, Inventory, VariantAttribute, Order, OrderItem, ReviewsModule, Transaction],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
