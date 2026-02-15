import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { faker } from '@faker-js/faker';
import { LikesService } from '../../modules/mongodb/likes/likes.service';
import { EventsService } from '../../modules/mongodb/events/events.service';
import { CommentsService } from '../../modules/mongodb/comments/comments.service';
import { LikeTargetType } from '../../modules/mongodb/likes/enums/like-target-type.enum';

async function seedLikes() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const likesService = app.get(LikesService);
  const eventsService = app.get(EventsService);
  const commentsService = app.get(CommentsService);

  console.log('Seeding likes...');

  const { data: events } = await eventsService.findAll({
    page: 1,
    limit: 10,
  });
  const { data: comments } = await commentsService.findAll({
    page: 1,
    limit: 10,
  });

  if (!events.length && !comments.length) {
    console.log('No events or comments found.');
    await app.close();
    return;
  }

  const fakeUsers = [1, 2, 3, 4, 5];

  // 🔥 Event Likes
  for (const event of events) {
    for (let i = 0; i < 3; i++) {
      try {
        await likesService.create(fakeUsers[i], {
          targetId: event._id.toString(),
          targetType: LikeTargetType.VIDEO,
        });
      } catch (err) {
        console.log('Duplicate or failed like (event)');
      }
    }
  }

  // 🔥 Comment Likes
  for (const comment of comments) {
    for (let i = 0; i < 2; i++) {
      try {
        await likesService.create(fakeUsers[i], {
          targetId: comment._id.toString(),
          targetType: LikeTargetType.COMMENT,
          isLike: faker.datatype.boolean(),
        });
      } catch (err) {
        console.log('Duplicate or failed like (comment)');
      }
    }
  }

  console.log('✅ Like seeding completed!');
  await app.close();
}

seedLikes().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
