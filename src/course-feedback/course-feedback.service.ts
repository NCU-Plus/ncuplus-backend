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
import { Comment, Review } from './content.entity';
import { PastExam } from './past-exam.entity';
import { createReadStream } from 'fs';
import { CourseFeedback } from './course-feedback.entity';
import { Reaction, ReactionType } from './reaction.entity';

@Injectable()
export class CourseFeedbackService {
  constructor(
    private readonly courseService: CourseService,
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

  async getCourseFeedback(classNo: string): Promise<CourseFeedback> {
    let courseFeedback = await this.courseFeedbackRepository.findOne(classNo, {
      select: ['classNo', 'comments', 'reviews', 'pastExams'],
    });
    if (!courseFeedback) {
      const courses = await this.courseService.getCoursesByClassNo(classNo);
      if (courses.length === 0) {
        throw new NotFoundException(`Course with classNo ${classNo} not found`);
      }
      courseFeedback = this.courseFeedbackRepository.create({
        classNo: classNo,
        reviews: [],
        comments: [],
        pastExams: [],
      });
      await this.courseFeedbackRepository.save(courseFeedback);
    }
    courseFeedback.pastExams = await this.getPastExams(courseFeedback);
    return courseFeedback;
  }

  async createComment(classNo: string, authorId: number, content: string) {
    if (content.length === 0)
      throw new BadRequestException('Comment cannot be empty');
    const courseFeedback = await this.getCourseFeedback(classNo);
    if (!courseFeedback)
      throw new NotFoundException(`Course with classNo ${classNo} not found`);
    const comment = this.commentRepository.create({
      authorId: authorId,
      content: content,
      courseFeedback: courseFeedback,
      reactions: [],
    });
    return await this.commentRepository.save(comment);
  }

  async editComment(commentId: number, content: string) {
    if (content.length === 0)
      throw new BadRequestException('Comment cannot be empty');
    const comment = await this.findOneComment(commentId);
    comment.content = content;
    return await this.commentRepository.save(comment);
  }

  async findOneComment(commentId: number) {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    return comment;
  }

  async deleteComment(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }

  async reactToComment(
    commentId: number,
    authorId: number,
    type: ReactionType,
  ) {
    return await this.reactToContent('comment', commentId, authorId, type);
  }
  private async reactToContent(
    target: 'comment' | 'review',
    id: number,
    authorId: number,
    type: ReactionType,
  ) {
    const content =
      target === 'comment'
        ? await this.commentRepository.findOne(id)
        : await this.reviewRepository.findOne(id);
    if (!content)
      throw new NotFoundException(`${target} with ID ${id} not found`);

    await this.checkLikeCondition(content, id, authorId);
    return await this.reactionRepository.save(
      this.reactionRepository.create({
        comment: target === 'comment' ? content : null,
        review: target === 'review' ? content : null,
        authorId,
        type,
      }),
    );
  }

  async createReview(
    classNo: string,
    authorId: number,
    content: string,
  ): Promise<Review> {
    if (content.length === 0)
      throw new BadRequestException('Review cannot be empty');
    const courseFeedback = await this.getCourseFeedback(classNo);
    if (!courseFeedback)
      throw new NotFoundException(`Course with classNo ${classNo} not found`);
    const review = this.reviewRepository.create({
      authorId: authorId,
      content: content,
      courseFeedback: courseFeedback,
      reactions: [],
    });
    return await this.reviewRepository.save(review);
  }

  async editReview(commentId: number, content: string): Promise<Review> {
    if (content.length === 0)
      throw new BadRequestException('Review cannot be empty');
    const review = await this.findOneReview(commentId);
    review.content = content;
    return await this.reviewRepository.save(review);
  }

  async findOneReview(commentId: number) {
    const review = await this.reviewRepository.findOne(commentId);
    if (!review)
      throw new NotFoundException(`Review with ID ${commentId} not found`);
    return review;
  }

  async deleteReview(reviewId: number): Promise<void> {
    await this.reviewRepository.delete(reviewId);
  }

  async reactToReview(reviewId: number, authorId: number, type: ReactionType) {
    return await this.reactToContent('review', reviewId, authorId, type);
  }

  async dislikeReview(reviewId: number, userId: number): Promise<Reaction> {
    const review = await this.findOneReview(reviewId);
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
    return await this.pastExamRepository.save(
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
  }

  async findOnePastExam(id: number) {
    const pastExam = await this.pastExamRepository.findOne(id);
    if (!pastExam)
      throw new NotFoundException(`PastExam with ID ${id} not found`);
    return pastExam;
  }

  async getPastExam(pastExamId: number) {
    const pastExam = await this.findOnePastExam(pastExamId);

    await this.pastExamRepository.increment(
      { id: pastExamId },
      'downloadCount',
      1,
    );

    return new StreamableFile(createReadStream(pastExam.path), {
      disposition: `attachment; filename=${encodeURIComponent(
        pastExam.originFilename,
      )}`,
    });
  }

  async deletePastExam(pastExamId: number) {
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
