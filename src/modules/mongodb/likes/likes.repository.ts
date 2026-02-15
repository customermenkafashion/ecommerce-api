import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from './entities/like.schema';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>) {}

  async toggleLike(userId: number, dto: CreateLikeDto) {
    const { targetId, targetType } = dto;
    const objectId = new Types.ObjectId(targetId);

    const existing = await this.likeModel.findOne({ userId, targetId: objectId, targetType });

    if (existing) {
      await this.likeModel.findByIdAndDelete(existing._id);
      return { isLiked: 'Unliked', data: existing };
    }

    const like = await this.likeModel.create({
      userId,
      targetId: objectId,
      targetType,
      isLike: true,
    });

    return { isLiked: 'Liked', data: like };
  }

  async findAll() {
    return this.likeModel.find();
  }

  async findOne(id: string) {
    const like = await this.likeModel.findById(id);
    if (!like) throw new NotFoundException('Like not found');
    return like;
  }

  async update(id: string, dto: UpdateLikeDto) {
    const updated = await this.likeModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Like not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.likeModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Like not found');
    return deleted;
  }

  async getLikesCount(targetId: string, targetType: string) {
    const objectId = new Types.ObjectId(targetId);
    const count = await this.likeModel.countDocuments({ targetId: objectId, targetType, isLike: true });
    return { targetId, totalLikes: count };
  }

  async isUserLiked(userId: number, targetId: string, targetType: string) {
    const objectId = new Types.ObjectId(targetId);
    const like = await this.likeModel.findOne({ userId, targetId: objectId, targetType, isLike: true });
    return { liked: !!like };
  }
}
