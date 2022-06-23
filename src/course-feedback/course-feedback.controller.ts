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
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CourseFeedbackService } from './course-feedback.service';

@Controller()
export class CourseFeedbackController {
  constructor(private readonly courseInfoService: CourseFeedbackService) {}
  @Get('course-feedbacks/:classNo')
  async getCourseFeedback(@Param('classNo') classNo: string) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.getCourseFeedback(classNo),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('course-feedbacks/:classNo/comments')
  async createComment(
    @Request() req,
    @Param('classNo') classNo: string,
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
  @Put('comments/:id')
  async updateComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.editComment(id, req.user.id, content),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  async deleteComment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.courseInfoService.deleteComment(id, req.user.id);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/like')
  async likeComment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.likeComment(id, req.user.id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/dislike')
  async dislikeComment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.dislikeComment(id, req.user.id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('course-feedbacks/:classNo/reviews')
  async createReview(
    @Request() req,
    @Param('classNo') classNo: string,
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
  @Put('reviews/:id')
  async updateReview(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.editReview(id, req.user.id, content),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  async deleteReview(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.courseInfoService.deleteReview(id, req.user.id);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('reviews/:id/like')
  async likeReview(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.likeReview(id, req.user.id),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('reviews/:id/dislike')
  async dislikeReview(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.dislikeReview(id, req.user.id),
    };
  }
  @HttpCode(201)
  @Post('course-feedbacks/:classNo/past-exams')
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
    @Param('classNo') classNo: string,
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
  @Get('past-exams/:id')
  getPastExam(@Param('id', ParseIntPipe) id: number) {
    return this.courseInfoService.getPastExam(id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('past-exams/:id')
  async deletePastExam(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.courseInfoService.deletePastExam(id, req.user.id);
    return { statusCode: 200, message: 'OK' };
  }
}
