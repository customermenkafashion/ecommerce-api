import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FramesService } from './frames.service';
import { CreateFrameDto } from './dto/create-frame.dto';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { FrameResource } from './frame.resource';
import { PaginationOptions } from '../../../common/dto/pagination-options.dto';

@Controller('frames')
export class FramesController {
  constructor(private readonly framesService: FramesService) {}

  // ✅ Create a frame
  @Post()
  async create(@Body() createFrameDto: CreateFrameDto): Promise<FrameResource> {
    const frame = await this.framesService.create(createFrameDto);
    return new FrameResource(frame);
  }

  // ✅ Get all frames with pagination and optional search
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const options: PaginationOptions = {
      page: Number(page),
      limit: Number(limit),
      search,
    };

    const { data: frames, total } = await this.framesService.findAll({
      page,
      limit,
      search,
    });
    const framesResources = FrameResource.collection(frames);
    return {
      frames: framesResources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),

    };
  }

  // ✅ Get a single frame
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FrameResource> {
    const frame = await this.framesService.findOne(id);
    return new FrameResource(frame);
  }

  // ✅ Update a frame
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFrameDto: UpdateFrameDto,
  ): Promise<FrameResource> {
    const frame = await this.framesService.update(id, updateFrameDto);
    return new FrameResource(frame);
  }

  // ✅ Delete a frame
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.framesService.remove(id);
  }

  // ✅ Optional: Get frames for a specific event with pagination
  @Get('event/:eventId')
  async findByEvent(
    @Param('eventId') eventId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ data: FrameResource[]; total: number }> {
    const options: PaginationOptions = {
      page: Number(page),
      limit: Number(limit),
      search,
    };

    const { data, total } = await this.framesService.findByEvent(eventId, options);
    return { data: data.map(frame => new FrameResource(frame)), total };
  }
}
