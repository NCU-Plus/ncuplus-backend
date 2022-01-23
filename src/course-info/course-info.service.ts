import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from '../course/course.service';
import { Repository } from 'typeorm';
import { CourseInfo } from './course-info.entity';

@Injectable()
export class CourseInfoService {
  constructor(
    private readonly courseService: CourseService,
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepository: Repository<CourseInfo>,
  ) {}
  async getCourseInfo(courseId: number): Promise<CourseInfo> {
    let courseInfo = await this.courseInfoRepository.findOne(courseId);
    if (!courseInfo) {
      if (!(await this.courseService.getCourse(courseId))) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }
      this.courseService.getCourse(courseId);
      courseInfo = new CourseInfo();
      courseInfo.courseId = courseId;
      courseInfo.reviews = [];
      courseInfo.comments = [];
      await this.courseInfoRepository.save(courseInfo);
    }
    return courseInfo;
  }
}
