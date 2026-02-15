import { EventReviewsDocument } from './entities/event-review.schema';

export class EventReviewResource {
  id: string;
  eventId: string;
  userId: string;
  review: string;
  rating: number;
  user: {};
  createdAt: Date;
  updatedAt: Date;

  constructor(eventReview: EventReviewsDocument) {
    this.id = eventReview._id.toString();
    this.eventId = eventReview.eventId.toString();
    this.userId = eventReview.userId.toString();
    this.review = eventReview.review;
    this.rating = eventReview.rating;
    this.user = {"name":"test user"};
    this.createdAt = eventReview.createdAt || new Date();
    this.updatedAt = eventReview.updatedAt || new Date();
  }

  // Optional: Static method to convert array of documents
  static collection(eventReviews: EventReviewsDocument[]): EventReviewResource[] {
    return eventReviews.map((review) => new EventReviewResource(review));
  }
}
