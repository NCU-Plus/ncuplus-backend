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
  @UseGuards(JwtAuthGuard)
  @Post('comment/edit')
  async editComment(
    @Request() req,
    @Body('commentId', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.editComment(id, req.user.id, content),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comment/delete')
  async deleteComment(
    @Request() req,
    @Body('commentId', ParseIntPipe) id: number,
  ) {
    await this.courseInfoService.deleteComment(id, req.user.id);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comment/like')
  async likeComment(
    @Request() req,
    @Body('commentId', ParseIntPipe) id: number,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.likeComment(id, req.user.id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comment/dislike')
  async dislikeComment(
    @Request() req,
    @Body('commentId', ParseIntPipe) id: number,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.dislikeComment(id, req.user.id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('review')
  async createReview(
    @Request() req,
    @Body('courseId', ParseIntPipe) courseId: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.createReview(
        courseId,
        req.user.id,
        content,
      ),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('review/edit')
  async editReview(
    @Request() req,
    @Body('reviewId', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.editReview(id, req.user.id, content),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('review/delete')
  async deleteReview(
    @Request() req,
    @Body('reviewId', ParseIntPipe) id: number,
  ) {
    await this.courseInfoService.deleteReview(id, req.user.id);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('review/like')
  async likeReview(@Request() req, @Body('reviewId', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.likeReview(id, req.user.id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('review/dislike')
  async dislikeReview(
    @Request() req,
    @Body('reviewId', ParseIntPipe) id: number,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.dislikeReview(id, req.user.id),
    };
  }
}
