import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from '../course/course.service';
import { Repository } from 'typeorm';
import { CourseInfo } from './course-info.entity';
import { Comment } from './comment.entity';
import { Review } from './review.entity';
import { PastExam } from './past-exam.entity';
import { createReadStream } from 'fs';
import { CourseFeedback } from './course-feedback.entity';
import { Reaction, ReactionType } from './reaction.entity';

@Injectable()
export class CourseFeedbackService {
  constructor(
    private readonly courseService: CourseService,
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepository: Repository<CourseInfo>,
    @InjectRepository(CourseFeedback)
    private readonly courseFeedbackRepository: Repository<CourseFeedback>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(PastExam)
    private readonly pastExamRepository: Repository<PastExam>,
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
      await this.courseInfoRepository.save(courseInfo);
    }
    return courseInfo;
  }
  async getCourseFeedback(classNo: string): Promise<CourseFeedback> {
    let courseFeedback = await this.courseFeedbackRepository.findOne(classNo, {
      select: ['classNo', 'comments', 'reviews', 'pastExams'],
    });
    if (!courseFeedback) {
      const courses = await this.courseService.getCoursesByClassNo(classNo);
      if (courses.length === 0) {
        throw new NotFoundException(`Course with classNo ${classNo} not found`);
      }
      courseFeedback = new CourseFeedback();
      courseFeedback.classNo = classNo;
      courseFeedback.reviews = [];
      courseFeedback.comments = [];
      courseFeedback.pastExams = [];
      const courseInfos: CourseInfo[] = [];
      for (const course of courses)
        courseInfos.push(await this.getCourseInfo(course.id));
      courseFeedback.courseInfos = courseInfos;
      await this.courseFeedbackRepository.save(courseFeedback);
    }
    courseFeedback.pastExams = await this.getPastExams(courseFeedback);
    return courseFeedback;
  }
  async createComment(classNo: string, authorId: number, content: string) {
    if (content === '')
      throw new BadRequestException('Comment cannot be empty');
    const courseFeedback = await this.getCourseFeedback(classNo);
    if (!courseFeedback)
      throw new NotFoundException(`Course with classNo ${classNo} not found`);
    const comment = this.commentRepository.create({
      authorId: authorId,
      content: content,
      courseFeedback: courseFeedback,
    });
    const saved = await this.commentRepository.save(comment);
    return {
      id: saved.id,
      content: saved.content,
      authorId: saved.authorId,
      reactions: saved.reactions,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
  async editComment(commentId: number, userId: number, content: string) {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    if (comment.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    comment.content = content;
    const saved = await this.commentRepository.save(comment);
    return {
      id: saved.id,
      content: saved.content,
      authorId: saved.authorId,
      reactions: saved.reactions,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    if (comment.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    await this.commentRepository.delete(commentId);
  }
  async likeComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne(commentId);
    await this.checkLikeCondition(comment, commentId, userId);

    const saved = await this.reactionRepository.save(
      this.reactionRepository.create({
        comment: comment,
        authorId: userId,
        type: ReactionType.LIKE,
      }),
    );
    return { id: saved.id, authorId: saved.authorId };
  }
  async dislikeComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne(commentId);
    await this.checkLikeCondition(comment, commentId, userId);

    const saved = await this.reactionRepository.save(
      this.reactionRepository.create({
        comment: comment,
        authorId: userId,
        type: ReactionType.DISLIKE,
      }),
    );
    return { id: saved.id, authorId: saved.authorId };
  }
  async createReview(
    classNo: string,
    authorId: number,
    content: string,
  ): Promise<Review> {
    if (content === '') throw new BadRequestException('Review cannot be empty');
    const courseFeedback = await this.getCourseFeedback(classNo);
    if (!courseFeedback)
      throw new NotFoundException(`Course with classNo ${classNo} not found`);
    const review = this.reviewRepository.create({
      authorId: authorId,
      content: content,
      courseFeedback: courseFeedback,
    });
    return await this.reviewRepository.save(review);
  }
  async editReview(
    commentId: number,
    userId: number,
    content: string,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne(commentId);
    if (!review)
      throw new NotFoundException(`Review with ID ${commentId} not found`);
    if (review.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    review.content = content;
    return await this.reviewRepository.save(review);
  }
  async deleteReview(commentId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne(commentId);
    if (!review)
      throw new NotFoundException(`Review with ID ${commentId} not found`);
    if (review.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    await this.reviewRepository.delete(commentId);
  }
  async likeReview(reviewId: number, userId: number): Promise<Reaction> {
    const review = await this.reviewRepository.findOne(reviewId);
    await this.checkLikeCondition(review, reviewId, userId);

    return await this.reactionRepository.save(
      this.reactionRepository.create({
        review: review,
        authorId: userId,
        type: ReactionType.LIKE,
      }),
    );
  }
  async dislikeReview(reviewId: number, userId: number): Promise<Reaction> {
    const review = await this.reviewRepository.findOne(reviewId);
    await this.checkLikeCondition(review, reviewId, userId);

    return await this.reactionRepository.save(
      this.reactionRepository.create({
        review: review,
        authorId: userId,
        type: ReactionType.LIKE,
      }),
    );
  }
  async getPastExams(courseFeedback: CourseFeedback) {
    const pastExams = await this.pastExamRepository.find({
      select: [
        'id',
        'year',
        'description',
        'originFilename',
        'size',
        'downloadCount',
        'uploaderId',
        'createdAt',
        'updatedAt',
      ],
      where: { courseFeedback: courseFeedback },
    });
    return pastExams;
  }
  async uploadPastExam(
    classNo: string,
    uploaderId: number,
    year: string,
    description: string,
    file: Express.Multer.File,
  ) {
    const saved = await this.pastExamRepository.save(
      this.pastExamRepository.create({
        uploaderId: uploaderId,
        year: year,
        description: description,
        originFilename: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype,
        courseFeedback: await this.getCourseFeedback(classNo),
      }),
    );
    return {
      id: saved.id,
      year: saved.year,
      description: saved.description,
      originFilename: saved.originFilename,
      size: saved.size,
      downloadCount: saved.downloadCount,
      uploaderId: saved.uploaderId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
  async getPastExam(pastExamId: number) {
    const pastExam = await this.pastExamRepository.findOne(pastExamId, {
      select: ['path', 'originFilename'],
    });
    if (!pastExam) {
      throw new NotFoundException(`Past Exam with ID ${pastExamId} not found`);
    }

    await this.pastExamRepository.increment(
      { id: pastExamId },
      'downloadCount',
      1,
    );

    return new StreamableFile(createReadStream(pastExam.path), {
      disposition: `attachment; filename=${pastExam.originFilename}`,
    });
  }
  async deletePastExam(pastExamId: number, userId: number) {
    const pastExam = await this.pastExamRepository.findOne(pastExamId);
    if (!pastExam)
      throw new NotFoundException(`Past Exam with ID ${pastExamId} not found`);
    if (pastExam.uploaderId !== userId)
      throw new ForbiddenException('You are not the uploader of this file');
    await this.pastExamRepository.delete(pastExamId);
  }
  private async checkLikeCondition(
    target: Comment | Review,
    commentId: number,
    userId: number,
  ) {
    if (!target)
      throw new NotFoundException(
        `${target.constructor.name} with ID ${commentId} not found`,
      );
    if (target.authorId === userId)
      throw new ForbiddenException(
        `You cannot like or dislike your own ${target.constructor.name}`,
      );

    let reactions: Reaction[];

    if (target instanceof Comment) {
      reactions = await this.reactionRepository.find({
        where: { comment: target, authorId: userId },
      });
    } else if (target instanceof Review) {
      reactions = await this.reactionRepository.find({
        where: { review: target, authorId: userId },
      });
    }

    if (reactions.length > 0)
      throw new ForbiddenException(
        'You have already liked or disliked this comment',
      );
  }
}
