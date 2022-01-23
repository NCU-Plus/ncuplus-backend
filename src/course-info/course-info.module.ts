import { Module } from '@nestjs/common';
import { CourseInfoService } from './course-info.service';
import { CourseInfoController } from './course-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseInfo } from './course-info.entity';
import { CourseModule } from '../course/course.module';
import { Review } from './review.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseInfo, Comment, Review]),
    CourseModule,
  ],
  providers: [CourseInfoService],
  controllers: [CourseInfoController],
})
export class CourseInfoModule {}
