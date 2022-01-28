import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseFeedback } from './course-feedback.entity';
import { CourseInfo } from './course-info.entity';

@Entity('PastExams')
export class PastExam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: string;

  @Column()
  description: string;

  @Column()
  originFilename: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  mimeType: string;

  @Column({ default: 0 })
  downloadCount: number;

  @Column()
  uploaderId: number;

  @ManyToOne(() => CourseFeedback, (courseFeedback) => courseFeedback.pastExams)
  courseFeedback: CourseFeedback;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
