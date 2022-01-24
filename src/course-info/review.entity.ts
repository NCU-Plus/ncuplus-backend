import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseInfo } from './course-info.entity';
import { ReviewDislike } from './review-dislike.entity';
import { ReviewLike } from './review-like.entity';

@Entity('Reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  authorId: number;

  @OneToMany(() => ReviewLike, (like) => like.review, { eager: true })
  likes: ReviewLike[];

  @OneToMany(() => ReviewDislike, (dislike) => dislike.review, { eager: true })
  dislikes: ReviewDislike[];

  @ManyToOne(() => CourseInfo, (courseInfo) => courseInfo.reviews)
  courseInfo: CourseInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
