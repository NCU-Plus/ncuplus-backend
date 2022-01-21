import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from './college.entity';
import { CourseController } from './course.controller';
import { Course } from './course.entity';
import { CourseService } from './course.service';

@Module({
  imports: [TypeOrmModule.forFeature([College, Course], 'coursesConnection')],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
