import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { faker } from '@faker-js/faker';
import { EventReviewsService } from '../../modules/mongodb/event-reviews/event-reviews.service';
import { EventsService } from '../../modules/mongodb/events/events.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const reviewService = app.get(EventReviewsService);
  const eventsService = app.get(EventsService);

  console.log('Seeding event reviews...');

  const { data: events } = await eventsService.findAll({
    page: 1,
    limit: 10,
  });

  if (!events.length) {
    console.log('No events found.');
    await app.close();
    return;
  }

  const fakeUsers = [1, 2, 3, 4, 5];

  for (const event of events) {
    // Random number of reviews per event
    const reviewCount = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < reviewCount; i++) {
      const userId = fakeUsers[faker.number.int({ min: 0, max: fakeUsers.length - 1 })];

      try {
        await reviewService.create({
          eventId: event._id.toString(),
          userId: userId,
          rating: faker.number.int({ min: 1, max: 5 }),
          review: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        });
      } catch (err) {
        console.log(`Failed to create review for event ${event._id}`, err.message);
      }
    }
  }

  console.log('✅ Event reviews seeding completed!');
  await app.close();
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});