
import { CommentDocument } from './entities/comment.schema';

export class CommentResource {
  id: string;
  eventId: string;
  userId: string;
  parentId?: string;
  text?: string;
  user: {};
  replies:CommentResource[];
  createdAt: Date;
  updatedAt: Date;

  constructor(comment: CommentDocument) {
    this.id = comment._id.toString();
    this.eventId = comment.eventId.toString();
    this.userId = comment.userId.toString();
    this.parentId = comment.parentId?.toString(); // ✅ safest way
    this.text = comment.text ?? undefined;
    this.user =  {"name":"test user"};
    // ✅ Properly map replies recursively
     this.replies = Array.isArray(comment.replies)
    ? comment.replies.map((reply) => new CommentResource(reply))
    : [];



    this.createdAt = comment.createdAt || new Date();
    this.updatedAt = comment.updatedAt || new Date();
  }

  static collection(comments: any[] | any) {
    if (Array.isArray(comments)) {
      return comments.map((comment) => new CommentResource(comment));
    }
    return new CommentResource(comments);
  }
}

