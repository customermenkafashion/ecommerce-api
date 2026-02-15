import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { Like, LikeSchema } from './entities/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]), // ✅ Mongoose schema
  ],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository], // ✅ Add LikesRepository here
  exports: [LikesService], // optional if you want to use LikesService elsewhere
})
export class LikesModule {}
