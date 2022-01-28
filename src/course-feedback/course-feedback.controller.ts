import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CourseInfoService } from './course-feedback.service';

@Controller('course-feedback')
export class CourseInfoController {
  constructor(private readonly courseInfoService: CourseInfoService) {}
  @Get(':classNo')
  async getCourseInfo(@Param('classNo') classNo: string) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.getCourseFeedback(classNo),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comment')
  async createComment(
    @Request() req,
    @Body('classNo') classNo: string,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.createComment(
        classNo,
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
    @Body('classNo') classNo: string,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.createReview(
        classNo,
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
  @HttpCode(201)
  @Post('past-exam/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/past-exam/',
      fileFilter(req, file, cb) {
        const acceptedMimetypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/zip',
          'application/x-7z-compressed',
          'application/x-rar-compressed',
        ];
        if (acceptedMimetypes.includes(file.mimetype)) cb(null, true);
        else cb(null, false);
      },
      limits: { fileSize: 15728640 }, // 15MB
    }),
  )
  async uploadFile(
    @Request() req,
    @Body('classNo') classNo: string,
    @Body('year') year: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is not accepted');
    return {
      statusCode: 201,
      message: 'Created',
      data: await this.courseInfoService.uploadPastExam(
        classNo,
        req.user.id,
        year,
        description,
        file,
      ),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('past-exam/:id')
  getPastExam(@Param('id', ParseIntPipe) id: number) {
    return this.courseInfoService.getPastExam(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('past-exam/delete')
  async deletePastExam(
    @Request() req,
    @Body('pastExamId', ParseIntPipe) id: number,
  ) {
    await this.courseInfoService.deletePastExam(id, req.user.id);
    return { statusCode: 200, message: 'OK' };
  }
}
