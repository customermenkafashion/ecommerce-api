import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../modules/mysql/products/services/products.service';
import { UsersService } from '../modules/mysql/users/users.service';
import { RolesService } from '../modules/mysql/roles/roles.service';
import { PermissionsService } from '../modules/mysql/permissions/permissions.service';
import { OrdersService } from '../modules/mysql/orders/orders.service';
import { AppDataSource } from './data-source';

import { ProductSeeder } from './seeders/product.seeder';
import { UserSeeder } from './seeders/user.seeder';
import { RoleSeeder } from './seeders/role.seeder';
import { PermissionSeeder } from './seeders/permission.seeder';
import { OrderSeeder } from './seeders/order.seeder';
import { OrderItemsService } from '../modules/mysql/order-items/order-items.service';

async function run() {
  await AppDataSource.initialize();

  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
   const rolesService = app.get(RolesService);
   const permissionsService = app.get(PermissionsService);

  const productsService = app.get(ProductsService);
  const ordersService = app.get(OrdersService);
  const orderItemsService = app.get(OrderItemsService);

  await UserSeeder(AppDataSource, usersService);
  await RoleSeeder(AppDataSource, rolesService);
  await PermissionSeeder(AppDataSource, permissionsService);



  await ProductSeeder(AppDataSource, productsService);
  await OrderSeeder(AppDataSource, ordersService, orderItemsService);

  await app.close();
  await AppDataSource.destroy();
}

run().catch(console.error);
