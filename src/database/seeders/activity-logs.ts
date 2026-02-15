import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ActivityLogsService } from '../../modules/mongodb/activity-logs/activity-logs.service';
import { faker } from '@faker-js/faker';
import { ActivityLog } from '../../modules/mongodb/activity-logs/entities/activity-logs.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const activityLogsService = app.get(ActivityLogsService);

  console.log('Seeding 100 activity logs...');

  for (let i = 0; i < 100; i++) {
    const log: Partial<ActivityLog> = {
      action: faker.helpers.arrayElement([
        'login',
        'logout',
        'update-profile',
        'purchase',
        'delete-account',
      ]),
      userId: 1,
      // userName: faker.person.fullName(),
      // userEmail: faker.internet.email(),
      ipAddress: faker.internet.ip(),
      device: faker.helpers.arrayElement([
        'iPhone 12',
        'Samsung Galaxy S21',
        'MacBook Pro',
        'Windows Laptop',
      ]),
      browser: faker.helpers.arrayElement(['Chrome', 'Safari', 'Firefox', 'Edge']),
      location: `${faker.location.city()}, ${faker.location.country()}`,
      // isSuccess: faker.datatype.boolean(),
      metadata: {
        productId: faker.datatype.boolean() ? faker.database.mongodbObjectId() : undefined,
        amount: faker.number.int({ min: 50, max: 1000 }),
        reason: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      },
      // createdAt: faker.date.recent({ days: 30 }), // now allowed
      // updatedAt: new Date(),                     // now allowed
    };

    await activityLogsService.create(log);
  }

  console.log('✅ Seeded 100 activity logs');
  await app.close();
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
