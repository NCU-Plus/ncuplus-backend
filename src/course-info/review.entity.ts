import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseInfo } from './course-info.entity';

@Entity('Reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @Column()
  likes: number;

  @Column()
  dislikes: number;

  @ManyToOne(() => CourseInfo, (courseInfo) => courseInfo.reviews)
  courseInfo: CourseInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
