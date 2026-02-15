import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepo.create(createReviewDto);
    return this.reviewRepo.save(review);
  }

  async findAll() {
    return this.reviewRepo.find();
  }

  async findOne(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review #${id} not found`);
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return this.reviewRepo.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepo.remove(review);
  }
}
