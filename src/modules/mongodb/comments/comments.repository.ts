// src/comments/comments.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {}

  async create(dto: CreateCommentDto): Promise<CommentDocument> {
    const comment = new this.commentModel({
      ...dto,
      eventId: new Types.ObjectId(dto.eventId),
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : undefined,
    });
    return comment.save();
  }

  async findAll(options: PaginationOptions): Promise<{ data: CommentDocument[]; total: number }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.text = { $regex: search, $options: 'i' };
    }

    const total = await this.commentModel.countDocuments(filter).exec();
    const data = await this.commentModel.find(filter).skip(skip).limit(limit).exec();

    return { data, total };
  }

  async findOne(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<CommentDocument> {
    const updated = await this.commentModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Comment not found');
  }
}
