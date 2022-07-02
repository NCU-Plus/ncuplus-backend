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
  ParseEnumPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment, Review } from './content.entity';
import { CourseFeedbackService } from './course-feedback.service';
import { CommentHook } from './hooks/comment.hook';
import { PastExamHook } from './hooks/past-exam.hook';
import { ReviewHook } from './hooks/review.hook';
import { PastExam } from './past-exam.entity';
import { Reaction, ReactionType } from './reaction.entity';

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

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Post('course-feedbacks/:classNo/comments')
  @UseAbility(Actions.create, Comment)
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

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Put('comments/:id')
  @UseAbility(Actions.update, Comment, CommentHook)
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.editComment(id, content),
    };
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Delete('comments/:id')
  @UseAbility(Actions.delete, Comment, CommentHook)
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    await this.courseInfoService.deleteComment(id);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Post('comments/:id/reactions')
  @UseAbility(Actions.create, Reaction) // check comment or review author is too hard to implement. help wanted.
  async reactToComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('type', new ParseEnumPipe(ReactionType)) type: ReactionType,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.reactToComment(id, req.user.id, type),
    };
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Post('course-feedbacks/:classNo/reviews')
  @UseAbility(Actions.create, Review)
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

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Put('reviews/:id')
  @UseAbility(Actions.update, Review, ReviewHook)
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.editReview(id, content),
    };
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Delete('reviews/:id')
  @UseAbility(Actions.delete, Review, ReviewHook)
  async deleteReview(@Param('id', ParseIntPipe) id: number) {
    await this.courseInfoService.deleteReview(id);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Post('reviews/:id/reactions')
  @UseAbility(Actions.create, Reaction)
  async reactToReview(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('type', new ParseEnumPipe(ReactionType)) type: ReactionType,
  ) {
    return {
      statusCode: 200,
      message: 'OK',
      data: await this.courseInfoService.reactToReview(id, req.user.id, type),
    };
  }

  @HttpCode(201)
  @Post('course-feedbacks/:classNo/past-exams')
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.create, PastExam)
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

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Get('past-exams/:id')
  @UseAbility(Actions.read, PastExam)
  async getPastExam(@Param('id', ParseIntPipe) id: number) {
    return await this.courseInfoService.getPastExam(id);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Delete('past-exams/:id')
  @UseAbility(Actions.delete, PastExam, PastExamHook)
  async deletePastExam(@Param('id', ParseIntPipe) id: number) {
    await this.courseInfoService.deletePastExam(id);
    return { statusCode: 200, message: 'OK' };
  }
}
