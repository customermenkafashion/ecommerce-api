// src/frames/frames.service.ts
import { Injectable } from '@nestjs/common';
import { FramesRepository } from './frames.repository';
import { CreateFrameDto } from './dto/create-frame.dto';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { FrameDocument } from './entities/frame.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class FramesService {
  constructor(private readonly framesRepo: FramesRepository) {}

  async create(dto: CreateFrameDto): Promise<FrameDocument> {
    return this.framesRepo.create(dto);
  }

  async findAll(options: PaginationOptions): Promise<{ data: FrameDocument[]; total: number }> {
    return this.framesRepo.findAll(options);
  }

  async findOne(id: string): Promise<FrameDocument> {
    return this.framesRepo.findOne(id);
  }

  async update(id: string, dto: UpdateFrameDto): Promise<FrameDocument> {
    return this.framesRepo.update(id, dto);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.framesRepo.remove(id);
    return { message: 'Frame deleted successfully' };
  }

  async findByEvent(eventId: string, options?: PaginationOptions): Promise<{ data: FrameDocument[]; total: number }> {
    return this.framesRepo.findByEvent(eventId, options);
  }
}
