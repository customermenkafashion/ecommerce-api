// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentDocument } from './entities/comment.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepo: CommentsRepository) {}

  async create(dto: CreateCommentDto): Promise<CommentDocument> {
    return this.commentsRepo.create(dto);
  }

  async findAll(options: PaginationOptions): Promise<{ data: CommentDocument[]; total: number }> {
    return this.commentsRepo.findAll(options);
  }

  async findOne(id: string): Promise<CommentDocument> {
    return this.commentsRepo.findOne(id);
  }

  async update(id: string, dto: UpdateCommentDto): Promise<CommentDocument> {
    return this.commentsRepo.update(id, dto);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.commentsRepo.remove(id);
    return { message: 'Comment deleted successfully' };
  }
}
