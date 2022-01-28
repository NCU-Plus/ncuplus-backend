import { ChildEntity, ManyToOne } from 'typeorm';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@ChildEntity('CommentLikes')
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;
}
