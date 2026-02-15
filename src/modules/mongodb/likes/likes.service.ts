import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepo: LikesRepository) {}

  async create(userId: number, dto: CreateLikeDto) {
    return this.likesRepo.toggleLike(userId, dto);
  }

  async findAll() {
    return this.likesRepo.findAll();
  }

  async findOne(id: string) {
    return this.likesRepo.findOne(id);
  }

  async update(id: string, dto: UpdateLikeDto) {
    return this.likesRepo.update(id, dto);
  }

  async remove(id: string) {
    return this.likesRepo.remove(id);
  }

  async getLikesCount(targetId: string, targetType: string) {
    return this.likesRepo.getLikesCount(targetId, targetType);
  }

  async isUserLiked(userId: number, targetId: string, targetType: string) {
    return this.likesRepo.isUserLiked(userId, targetId, targetType);
  }
}
