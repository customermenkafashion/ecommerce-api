import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';
// import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Name is required' })
  // @IsString({ message: 'Name must be string' })
  text: string; // the actual comment text

  @IsNotEmpty()
  // @IsMongoId()
  eventId: string; // the event this frame belongs to

  @IsOptional()
  @IsString()
  parentId?: string; // comment for an event

  @IsOptional()
  @IsString()
  userId?: number; // comment for an event

  

}
