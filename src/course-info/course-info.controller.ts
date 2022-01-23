import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CourseInfoService } from './course-info.service';

@Controller('course-info')
export class CourseInfoController {
  constructor(private readonly courseInfoService: CourseInfoService) {}
  @Get(':id')
  async getCourseInfo(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.getCourseInfo(id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comment')
  async createComment(
    @Request() req,
    @Body('courseId', ParseIntPipe) courseId: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.createComment(
        courseId,
        req.user.id,
        content,
      ),
    };
  }
}
