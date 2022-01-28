import { ChildEntity, ManyToOne } from 'typeorm';
import { Dislike } from './dislike.entity';
import { Review } from './review.entity';

@ChildEntity('ReviewDislikes')
export class ReviewDislike extends Dislike {
  @ManyToOne(() => Review, (review) => review.dislikes)
  review: Review;
}
