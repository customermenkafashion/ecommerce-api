import { LikeDocument } from './entities/like.schema';

export class LikeResource {
  id: string;
  userId: string;
  targetId: string;
  targetType: string;
  isLike: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(like: LikeDocument) {
    this.id = like._id.toString();
    this.userId = like.userId.toString();
    this.targetId = like.targetId.toString();
    this.targetType = like.targetType;
    this.isLike = like.isLike;
    // this.createdAt = like.createdAt;
    // this.updatedAt = like.updatedAt;
  }

  static collection(data: LikeDocument[] | LikeDocument) {
    if (Array.isArray(data)) {
      return data.map((item) => new LikeResource(item));
    }
    return new LikeResource(data);
  }
}
