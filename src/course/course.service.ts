import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course, 'coursesConnection')
    private courseRepository: Repository<Course>,
  ) {}
  async getCourses(): Promise<Course[]> {
    return await this.courseRepository.find({
      select: [
        'id',
        'year',
        'semester',
        'serialNo',
        'classNo',
        'title',
        'credit',
        'passwordCard',
        'teachers',
        'classTimes',
        'limitCnt',
        'admitCnt',
        'waitCnt',
        'collegeId',
        'departmentId',
        'courseType',
      ],
    });
  }
  async getCourse(id: number): Promise<Course> {
    return await this.courseRepository.findOne(id, {
      select: [
        'id',
        'year',
        'semester',
        'serialNo',
        'classNo',
        'title',
        'credit',
        'passwordCard',
        'teachers',
        'classTimes',
        'limitCnt',
        'admitCnt',
        'waitCnt',
        'collegeId',
        'departmentId',
        'courseType',
      ],
    });
  }
}
