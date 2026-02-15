import { Injectable, NotFoundException } from '@nestjs/common';
import { EventReviewsRepository } from './event-review.repository';
import { CreateEventReviewDto } from './dto/create-event-review.dto';
import { UpdateEventReviewDto } from './dto/update-event-review.dto';
import { EventReview, EventReviewsDocument } from './entities/event-review.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class EventReviewsService {
  constructor(private readonly repo: EventReviewsRepository) {}

  async create(dto: CreateEventReviewDto): Promise<EventReviewsDocument> {
    return this.repo.create(dto);
  }

  async findAll(pagination: PaginationOptions): Promise<{ data: EventReviewsDocument[]; total: number }> {
    return this.repo.findAll(pagination);
  }

  async findOne(id: string): Promise<EventReviewsDocument> {
    const review = await this.repo.findOne(id);
    if (!review) throw new NotFoundException(`Review not found: ${id}`);
    return review;
  }

  async update(id: string, dto: UpdateEventReviewDto): Promise<EventReviewsDocument> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`Review not found: ${id}`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    return this.repo.remove(id);
  }
}
