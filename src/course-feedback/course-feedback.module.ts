import { Module } from '@nestjs/common';
import { CourseFeedbackService } from './course-feedback.service';
import { CourseFeedbackController } from './course-feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseInfo } from './course-info.entity';
import { CourseModule } from '../course/course.module';
import { Review } from './review.entity';
import { Comment } from './comment.entity';
import { PastExam } from './past-exam.entity';
import { CourseFeedback } from './course-feedback.entity';
import { Reaction } from './reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseInfo,
      CourseFeedback,
      Comment,
      Review,
      Reaction,
      PastExam,
    ]),
    CourseModule,
  ],
  providers: [CourseFeedbackService],
  controllers: [CourseFeedbackController],
})
export class CourseFeedbackModule {}
