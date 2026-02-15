import { FrameDocument, FrameType } from './entities/frame.schema';

export class FrameResource {
  id: string;
  eventId: string;
  type: FrameType;
  contentUrl?: string;
  productId?: string;
  timestamp?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(frame: FrameDocument) {
    this.id = frame._id.toString();
    this.eventId = frame.eventId.toString();
    this.type = frame.type;
    this.contentUrl = frame.contentUrl ?? undefined;
    this.productId = frame.productId?.toString();
    this.timestamp = frame.timestamp ?? undefined;
    this.description = frame.description ?? undefined;
    this.createdAt = frame.createdAt || new Date();
    this.updatedAt = frame.updatedAt || new Date();
  }

  static collection(frames: any[] | any) {
    if (Array.isArray(frames)) {
      return frames.map((frame) => new FrameResource(frame));
    }
    return new FrameResource(frames);
  }
}
