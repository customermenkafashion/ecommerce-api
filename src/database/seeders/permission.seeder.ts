import { DataSource } from 'typeorm';
import { Permission } from '../../modules/mysql/permissions/entities/permission.entity';
import { PermissionsService } from '../../modules/mysql/permissions/permissions.service';

export async function PermissionSeeder(
    dataSource: DataSource,
    permissionsService: PermissionsService, 
) {
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = [
    // User
    { name: 'user.create', description: 'Create user' },
    { name: 'user.read', description: 'View users' },
    { name: 'user.update', description: 'Update user' },
    { name: 'user.delete', description: 'Delete user' },

    // Product
    { name: 'product.create', description: 'Create product' },
    { name: 'product.read', description: 'View products' },
    { name: 'product.update', description: 'Update product' },
    { name: 'product.delete', description: 'Delete product' },

    // Order
    { name: 'order.create', description: 'Create order' },
    { name: 'order.read', description: 'View orders' },
    { name: 'order.update', description: 'Update order' },
    { name: 'order.delete', description: 'Cancel order' },
  ];

  for (const p of permissions) {
    const exists = await permissionRepo.findOne({
      where: { name: p.name },
    });

    if (!exists) {
      await permissionRepo.save(permissionRepo.create(p));
    }
  }

  console.log('✅ Permissions seeded!');
}
