// events.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './entities/event.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(data: Partial<Event>): Promise<EventDocument> {
    const event = new this.eventModel(data);
    return event.save();
  }

  async findAll({ page, limit, search, userId }: PaginationOptions): Promise<{ data: EventDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.eventModel.countDocuments(filter).exec();

    const data = await this.eventModel
      .find(filter)
      .populate({
        path: 'frames',
        options: { limit: 10, sort: { createdAt: -1 } }, // latest 10 frames
      })
      .populate({
        path: 'comments',
        options: { limit: 10, sort: { createdAt: -1 } }, // latest 10 comments
        populate: [
          { path: 'userId', select: 'name' },
          {
            path: 'replies',
            populate: { path: 'userId', select: 'name' },
          },
        ],
      })
      .populate('likes_count')
      .populate({
        path: 'likes',
        match: {
          userId: userId,
          targetType: 'Video',
          isLike: true,
        },
        select: '_id',
      })
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findOne(id: string): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException(`Event not found: ${id}`);
    return event;
  }

  async update(id: string, data: Partial<Event>): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.eventModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Event not found: ${id}`);
    return updated;
  }

  async remove(id: string): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const deleted = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Event not found: ${id}`);
    return deleted;
  }
}
