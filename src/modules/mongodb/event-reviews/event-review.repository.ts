import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventReview, EventReviewsDocument } from './entities/event-review.schema';
import { CreateEventReviewDto } from './dto/create-event-review.dto';
import { UpdateEventReviewDto } from './dto/update-event-review.dto';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class EventReviewsRepository {
  constructor(
    @InjectModel(EventReview.name)
    private readonly model: Model<EventReviewsDocument>,
  ) {}

  async create(dto: CreateEventReviewDto): Promise<EventReviewsDocument> {
    const created = new this.model({
      ...dto,
      eventId: new Types.ObjectId(dto.eventId),
      userId: dto.userId,
    });
    return created.save();
  }

  async findAll(pagination: PaginationOptions): Promise<{ data: EventReviewsDocument[]; total: number }> {
    const { page, limit, search, userId, eventId } = pagination;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) filter.review = { $regex: search, $options: 'i' };
    // if (userId) filter.userId =  userId;
    if (eventId) filter.eventId = new Types.ObjectId(eventId);

    const total = await this.model.countDocuments(filter).exec();

    const data = await this.model
      .find(filter)
      .sort({ createdAt: -1 }) // latest reviews first
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findOne(id: string): Promise<EventReviewsDocument | null> {
    return this.model.findById(id).populate('userId', 'name').exec();
  }

  async update(id: string, dto: UpdateEventReviewDto): Promise<EventReviewsDocument | null> {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }
}
