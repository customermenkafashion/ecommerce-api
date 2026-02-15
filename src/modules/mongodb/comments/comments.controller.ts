import { UseGuards,Query, Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResource } from './comment.resource';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}


  @Post()
  @UseGuards(AuthGuard('jwt'))   // 🔥 Protect route
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    console.log("user", req.user);

    const userId = req.user.id; // from JWT payload

    const comment = await this.commentsService.create({
      ...createCommentDto,
      userId,
    });

    const commentsResources = CommentResource.collection(comment);
    return {
       comments: commentsResources,
     };
  }



  @Get()
   async findAll(
     @Query('page') page = 1,
     @Query('limit') limit = 10,
     @Query('search') search?: string,
   ) {
     page = Number(page);
     limit = Number(limit);
 
     const { data: comments, total } = await this.commentsService.findAll({
       page,
       limit,
       search,
     });
 
     const eventResources = CommentResource.collection(comments);
 
     return {
       comments: eventResources,
       total,
       page,
       limit,
       totalPages: Math.ceil(total / limit),
 
     };
   }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);   // ✅ just pass id
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);  // ✅ just pass id
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);   // ✅ just pass id
  }
}
