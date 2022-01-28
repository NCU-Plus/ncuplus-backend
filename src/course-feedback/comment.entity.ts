import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentDislike } from './comment-dislike.entity';
import { CommentLike } from './comment-like.entity';
import { CourseFeedback } from './course-feedback.entity';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @OneToMany(() => CommentLike, (like) => like.comment, { eager: true })
  likes: CommentLike[];

  @OneToMany(() => CommentDislike, (dislike) => dislike.comment, {
    eager: true,
  })
  dislikes: CommentDislike[];

  @ManyToOne(() => CourseFeedback, (courseFeedback) => courseFeedback.comments)
  courseFeedback: CourseFeedback;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
