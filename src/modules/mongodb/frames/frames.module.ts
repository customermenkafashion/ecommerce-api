import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FramesService } from './frames.service';
import { FramesController } from './frames.controller';
import { FramesRepository } from './frames.repository';
import { Frame, FrameSchema } from './entities/frame.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Frame.name, schema: FrameSchema }]),
  ],
  controllers: [FramesController],
  providers: [FramesService, FramesRepository],
  exports: [FramesService],
})
export class FramesModule {}
