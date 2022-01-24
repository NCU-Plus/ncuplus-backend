import { Module } from '@nestjs/common';
import { CourseInfoService } from './course-info.service';
import { CourseInfoController } from './course-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseInfo } from './course-info.entity';
import { CourseModule } from '../course/course.module';
import { Review } from './review.entity';
import { Comment } from './comment.entity';
import { CommentLike } from './comment-like.entity';
import { ReviewLike } from './review-like.entity';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { CommentDislike } from './comment-dislike.entity';
import { ReviewDislike } from './review-dislike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseInfo,
      Comment,
      Review,
      Like,
      CommentLike,
      ReviewLike,
      CommentDislike,
      ReviewDislike,
    ]),
    CourseModule,
  ],
  providers: [CourseInfoService],
  controllers: [CourseInfoController],
})
export class CourseInfoModule {}
