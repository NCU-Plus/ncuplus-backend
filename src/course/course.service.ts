import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from './college.entity';
import { Course } from './course.entity';
import { Department } from './department.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(College, 'coursesConnection')
    private collegeRepository: Repository<College>,
    @InjectRepository(Department, 'coursesConnection')
    private departmentRepository: Repository<Department>,
    @InjectRepository(Course, 'coursesConnection')
    private courseRepository: Repository<Course>,
  ) {}
}
