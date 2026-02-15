import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { FramesService } from '../../modules/mongodb/frames/frames.service';
import { EventsService } from '../../modules/mongodb/events/events.service';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { FrameType } from '../../modules/mongodb/frames/entities/frame.schema';

async function seedFrames() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const framesService = app.get(FramesService);
  const eventsService = app.get(EventsService);

  console.log('Seeding frames...');

  // Fetch all events to attach frames
 const { data: events } = await eventsService.findAll({
    page: 1,
    limit: 10,
  });
  
  if (!events.length) {
    console.error('No events found. Seed some events first.');
    await app.close();
    return;
  }

  const frameTypes: FrameType[] = [FrameType.VIDEO, FrameType.IMAGE, FrameType.PRODUCT];

  for (const event of events) {
    // Each event will have 3–5 frames
    const frameCount = faker.number.int({ min: 3, max: 5 });

    for (let i = 0; i < frameCount; i++) {
      const type = faker.helpers.arrayElement(frameTypes);

      const frameData: any = {
        eventId: event._id,
        userId:1,
        type,
        description: faker.lorem.sentence(),
        timestamp: type !== FrameType.PRODUCT ? faker.number.int({ min: 0, max: 600 }) : undefined,
      };

      if (type === FrameType.PRODUCT) {
        // Simulate a product ID
        frameData.productId = new Types.ObjectId();
      } else {
        // VIDEO or IMAGE URL using faker.string.alphanumeric
        frameData.contentUrl =
          type === FrameType.VIDEO
            ? `/uploads/videos/${faker.string.alphanumeric(10)}.mp4`
            : `/uploads/images/${faker.string.alphanumeric(10)}.jpg`;
      }

      try {
        await framesService.create(frameData);
        console.log(`Seeded ${type} frame for event "${event.title}"`);
      } catch (err: any) {
        console.error(`Failed to seed frame for event "${event.title}":`, err.message);
      }
    }
  }

  console.log('✅ Frame seeding complete!');
  await app.close();
}

seedFrames().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
