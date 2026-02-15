import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayListDto } from './create-play-list.dto';

export class UpdatePlayListDto extends PartialType(CreatePlayListDto) {}
