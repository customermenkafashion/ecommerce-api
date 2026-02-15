// events.service.ts
import { Injectable } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventDocument } from './entities/event.schema';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepo: EventsRepository) {}

  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    return this.eventsRepo.create(createEventDto);
  }

  async findAll(options: PaginationOptions): Promise<{ data: EventDocument[]; total: number }> {
    return this.eventsRepo.findAll(options);
  }

  async findOne(id: string): Promise<EventDocument> {
    return this.eventsRepo.findOne(id);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventDocument> {
    return this.eventsRepo.update(id, updateEventDto);
  }

  async remove(id: string): Promise<EventDocument> {
    return this.eventsRepo.remove(id);
  }
}
