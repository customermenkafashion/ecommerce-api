import { Injectable } from '@nestjs/common';
import { CreatePlayListDto } from './dto/create-play-list.dto';
import { UpdatePlayListDto } from './dto/update-play-list.dto';

@Injectable()
export class PlayListService {
  create(createPlayListDto: CreatePlayListDto) {
    return 'This action adds a new playList';
  }

  findAll() {
    return `This action returns all playList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playList`;
  }

  update(id: number, updatePlayListDto: UpdatePlayListDto) {
    return `This action updates a #${id} playList`;
  }

  remove(id: number) {
    return `This action removes a #${id} playList`;
  }
}
