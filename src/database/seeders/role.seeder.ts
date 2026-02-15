import { DataSource } from 'typeorm';
import { Role } from '../../modules/mysql/roles/entities/role.entity';
import { RolesService } from '../../modules/mysql/roles/roles.service';

export async function RoleSeeder(
    dataSource: DataSource,
    rolesService:RolesService
) {
  const roleRepo = dataSource.getRepository(Role);

  const roles = [
    { name: 'admin', description: 'System Administrator' },
    { name: 'seller', description: 'Seller / Vendor' },
    { name: 'customer', description: 'Customer / Buyer' },
  ];

  for (const r of roles) {
    const exists = await roleRepo.findOne({ where: { name: r.name } });

    if (!exists) {
      await roleRepo.save(roleRepo.create(r));
    }
  }

  console.log('✅ Roles seeded!');
}
