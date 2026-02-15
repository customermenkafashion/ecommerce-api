import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { faker } from '@faker-js/faker';
import { CommentsService } from '../../modules/mongodb/comments/comments.service';
import { Types } from 'mongoose';
import { EventsService } from '../../modules/mongodb/events/events.service';

async function seedComments() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const commentsService = app.get(CommentsService);
  const eventsService = app.get(EventsService);

  console.log('Seeding 50 comments...');

  const { data: events } = await eventsService.findAll({
    page: 1,
    limit: 10,
  });
  
  if (!events.length) {
    console.error('No events found. Seed some events first.');
    await app.close();
    return;
  }

   for (const event of events) {

        for (let i = 0; i < 2; i++) {
            const commentData = {
                userId: 1,   // ✅ convert to string
                eventId: event._id.toString(),
                text: faker.lorem.sentence(),
            };


            try {
            await commentsService.create(commentData); 
            console.log(`Comment "${commentData.text}" seeded`);
            } catch (err) {
            console.error(`Failed to seed comment "${commentData.text}":`, err.message);
            }
        }
    }    


  console.log('✅ Seeded 50 comments');
  await app.close();
}

seedComments().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
