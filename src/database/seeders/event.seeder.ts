import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from '../../modules/mongodb/events/entities/event.schema';
import { EventsService } from '../../modules/mongodb/events/events.service';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { faker } from '@faker-js/faker';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventsService = app.get(EventsService);

  console.log('Seeding 50 events...');

  for (let i = 0; i < 50; i++) {
    const eventData: Partial<Event> = {
        title: 'Product Launch Event',
        filename: 'product_launch.mp4',
        path: '/uploads/product_launch.mp4',
        duration: 360,
        format: 'mp4',
        // userId: new Types.ObjectId(), // replace with real userId
        userId: 1, // replace with real userId
        isActive: true,
    };

    try {
      await eventsService.create(eventData);
      console.log(`Event "${eventData.title}" seeded`);
    } catch (err) {
      console.error(`Failed to seed event "${eventData.title}":`, err.message);
    }
  }

  console.log('✅ Seeded 50 events');
  await app.close();
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});