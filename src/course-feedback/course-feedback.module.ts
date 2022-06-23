import { Module } from '@nestjs/common';
import { CourseFeedbackService } from './course-feedback.service';
import { CourseFeedbackController } from './course-feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from '../course/course.module';
import { Comment, Review } from './content.entity';
import { PastExam } from './past-exam.entity';
import { CourseFeedback } from './course-feedback.entity';
import { Reaction } from './reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
