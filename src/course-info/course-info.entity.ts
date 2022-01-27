import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { PastExam } from './past-exam.entity';
import { Review } from './review.entity';

@Entity('CourseInfos')
export class CourseInfo {
  @PrimaryColumn()
  courseId: number;

  @OneToMany(() => Comment, (comment) => comment.courseInfo, { eager: true })
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.courseInfo, { eager: true })
  reviews: Review[];

  @OneToMany(() => PastExam, (pastExam) => pastExam.courseInfo)
  pastExams: PastExam[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
