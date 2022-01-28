import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PastExam } from './past-exam.entity';
import { Review } from './review.entity';
import { Comment } from './comment.entity';
import { CourseInfo } from './course-info.entity';

@Entity('CourseFeedbacks')
export class CourseFeedback {
  @PrimaryColumn()
  classNo: string;

  @OneToMany(() => Comment, (comment) => comment.courseFeedback, {
    eager: true,
  })
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.courseFeedback, { eager: true })
  reviews: Review[];

  @OneToMany(() => PastExam, (pastExam) => pastExam.courseFeedback)
  pastExams: PastExam[];

  @OneToMany(() => CourseInfo, (courseInfo) => courseInfo.courseFeedback, {
    eager: true,
  })
  courseInfos: CourseInfo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
