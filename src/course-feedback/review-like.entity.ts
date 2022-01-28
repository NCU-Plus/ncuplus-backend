import { ChildEntity, ManyToOne } from 'typeorm';
import { Like } from './like.entity';
import { Review } from './review.entity';

@ChildEntity('ReviewLikes')
export class ReviewLike extends Like {
  @ManyToOne(() => Review, (review) => review.likes)
  review: Review;
}
