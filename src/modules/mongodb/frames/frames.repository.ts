// src/frames/frames.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Frame, FrameDocument } from './entities/frame.schema';
import { CreateFrameDto } from './dto/create-frame.dto';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class FramesRepository {
  constructor(
    @InjectModel(Frame.name) private readonly frameModel: Model<FrameDocument>,
  ) {}

  async create(dto: CreateFrameDto): Promise<FrameDocument> {
    const frame = new this.frameModel(dto);
    return frame.save();
  }

  async findAll(options: PaginationOptions): Promise<{ data: FrameDocument[]; total: number }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.frameModel.countDocuments(filter).exec();
    const data = await this.frameModel.find(filter).skip(skip).limit(limit).exec();

    return { data, total };
  }

  async findOne(id: string): Promise<FrameDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const frame = await this.frameModel.findById(id).exec();
    if (!frame) throw new NotFoundException(`Frame not found: ${id}`);
    return frame;
  }

  async update(id: string, dto: UpdateFrameDto): Promise<FrameDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.frameModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Frame not found: ${id}`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const deleted = await this.frameModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Frame not found: ${id}`);
  }

  async findByEvent(eventId: string, options?: PaginationOptions): Promise<{ data: FrameDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(eventId)) throw new NotFoundException('Invalid Event ID');

    const { page = 1, limit = 10, search } = options || {};
    const skip = (page - 1) * limit;

    const filter: any = { eventId: new Types.ObjectId(eventId) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.frameModel.countDocuments(filter).exec();
    const data = await this.frameModel.find(filter).skip(skip).limit(limit).exec();

    return { data, total };
  }
}
