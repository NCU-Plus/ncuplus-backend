import { ChildEntity, ManyToOne } from 'typeorm';
import { Dislike } from './dislike.entity';
import { Comment } from './comment.entity';

@ChildEntity('CommentDislikes')
export class CommentDislike extends Dislike {
  @ManyToOne(() => Comment, (comment) => comment.dislikes)
  comment: Comment;
}
