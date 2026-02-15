import { DataSource } from 'typeorm';
import { User } from '../../modules/mysql/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../modules/mysql/users/users.service';

export async function UserSeeder(
   dataSource: DataSource,
   usersService: UsersService, // Injected
) {
  const repo = dataSource.getRepository(User);
  const password = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'Admin', email: 'admin@example.com', password, role: 'admin', is_active: true },
    { name: 'Seller', email: 'seller@example.com', password, role: 'seller', is_active: true },
    { name: 'Customer', email: 'customer@example.com', password, role: 'customer', is_active: true },
  ];

  for (const u of users) {
    const exists = await repo.findOne({ where: { email: u.email } });
    if (!exists) await repo.save(repo.create(u));
  }

  console.log('✅ Users seeded!');
}
