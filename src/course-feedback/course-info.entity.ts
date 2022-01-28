import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseFeedback } from './course-feedback.entity';

@Entity('CourseInfos')
export class CourseInfo {
  @PrimaryColumn()
  courseId: number;

  @ManyToOne(
    () => CourseFeedback,
    (courseFeedback) => courseFeedback.courseInfos,
  )
  courseFeedback: CourseFeedback;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
