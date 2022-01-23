import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CourseInfoService } from './course-info.service';

@Controller('course-info')
export class CourseInfoController {
  constructor(private readonly courseInfoService: CourseInfoService) {}
  @Get(':id')
  async getCourseInfo(@Param('id', ParseIntPipe) id: number) {
    try {
      return {
        statusCode: 200,
        message: 'OK',
        data: await this.courseInfoService.getCourseInfo(id),
      };
    } catch (error) {
      throw error;
    }
  }
}
