
import { EventPopulatedDocument } from './entities/event.schema';
import { FrameResource } from '../frames/frame.resource';
import { CommentResource } from '../comments/comment.resource';


export class EventResource {
  id: string;
  title: string;
  filename: string;
  path: string;
  duration?: number;
  format?: string;
  userId: string;
  isActive: boolean;
  frames: FrameResource[];
  comments: CommentResource[];
  likes_count: number;  // <-- added
  isLiked?: boolean; 
  createdAt: Date;
  updatedAt: Date;

  constructor(event: EventPopulatedDocument) {
    this.id = event._id.toString();
    this.title = event.title;
    this.filename = event.filename;
    this.path = event.path;
    this.duration = event.duration;
    this.format = event.format;
    this.userId = event.userId.toString();
    this.isActive = event.isActive;

    this.frames = (event.frames || []).map(f => new FrameResource(f));
    this.comments = (event.comments || []).map(f => new CommentResource(f));
  
    // If you populated like_count via Mongoose virtual
    this.likes_count = (event.likes_count as number) || 0;
    this.isLiked = !!(event.likes && event.likes.length > 0);
    this.createdAt = event.createdAt || new Date();
    this.updatedAt = event.updatedAt || new Date();
  }

  static collection(events: any[] | any) {
    if (Array.isArray(events)) {
      return events.map((event) => new EventResource(event));
    }
    return new EventResource(events);
  }
}
