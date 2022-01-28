import { Module } from '@nestjs/common';
import { CourseInfoService } from './course-feedback.service';
import { CourseInfoController } from './course-feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseInfo } from './course-info.entity';
import { CourseModule } from '../course/course.module';
import { Review } from './review.entity';
import { Comment } from './comment.entity';
import { CommentLike } from './comment-like.entity';
import { ReviewLike } from './review-like.entity';
import { Like } from './like.entity';
import { CommentDislike } from './comment-dislike.entity';
import { ReviewDislike } from './review-dislike.entity';
import { PastExam } from './past-exam.entity';
import { CourseFeedback } from './course-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseInfo,
      CourseFeedback,
      Comment,
      Review,
      Like,
      CommentLike,
      ReviewLike,
      CommentDislike,
      ReviewDislike,
      PastExam,
    ]),
    CourseModule,
  ],
  providers: [CourseInfoService],
  controllers: [CourseInfoController],
})
export class CourseInfoModule {}
