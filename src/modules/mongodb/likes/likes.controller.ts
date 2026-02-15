import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { LikeResource } from './like.resource';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // ✅ Toggle like
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Body() dto: CreateLikeDto) {
    const userId = req.user.id;
    const result = await this.likesService.create(userId, dto);

    return {
      success: true,
      isLiked: result.isLiked,
      like: new LikeResource(result.data),
    };
  }

  // ✅ Get all likes
  @Get()
  async findAll() {
    const likes = await this.likesService.findAll();
    return {
      success: true,
      data: LikeResource.collection(likes),
    };
  }

  // ✅ Get single like
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const like = await this.likesService.findOne(id);
    return {
      success: true,
      data: new LikeResource(like),
    };
  }

  // ✅ Update like
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLikeDto) {
    const like = await this.likesService.update(id, dto);
    return {
      success: true,
      data: new LikeResource(like),
    };
  }

  // ✅ Delete like
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.likesService.remove(id);
    return { success: true, message: 'Like deleted successfully' };
  }

  // ✅ Get likes count for a target
  @Get('count/:targetType/:targetId')
  async getLikesCount(@Param('targetId') targetId: string, @Param('targetType') targetType: string) {
    return this.likesService.getLikesCount(targetId, targetType);
  }

  // ✅ Check if user liked
  @Get('check/:targetType/:targetId')
  @UseGuards(AuthGuard('jwt'))
  async isUserLiked(@Req() req, @Param('targetId') targetId: string, @Param('targetType') targetType: string) {
    const userId = req.user.id;
    return this.likesService.isUserLiked(userId, targetId, targetType);
  }
}
