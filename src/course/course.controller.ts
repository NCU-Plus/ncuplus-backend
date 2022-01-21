import { Controller, Get } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Get()
  async getCourses() {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseService.getCourses(),
    };
  }
}
