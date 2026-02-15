import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayListService } from './play-list.service';
import { CreatePlayListDto } from './dto/create-play-list.dto';
import { UpdatePlayListDto } from './dto/update-play-list.dto';

@Controller('play-list')
export class PlayListController {
  constructor(private readonly playListService: PlayListService) {}

  @Post()
  create(@Body() createPlayListDto: CreatePlayListDto) {
    return this.playListService.create(createPlayListDto);
  }

  @Get()
  findAll() {
    return this.playListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayListDto: UpdatePlayListDto) {
    return this.playListService.update(+id, updatePlayListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playListService.remove(+id);
  }
}
