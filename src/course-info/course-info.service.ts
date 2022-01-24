import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from '../course/course.service';
import { Repository } from 'typeorm';
import { CourseInfo } from './course-info.entity';
import { Comment } from './comment.entity';
import { Review } from './review.entity';
import { Like } from './like.entity';
import { CommentDislike } from './comment-dislike.entity';
import { CommentLike } from './comment-like.entity';
import { Dislike } from './dislike.entity';
import { ReviewDislike } from './review-dislike.entity';
import { ReviewLike } from './review-like.entity';

@Injectable()
export class CourseInfoService {
  constructor(
    private readonly courseService: CourseService,
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepository: Repository<CourseInfo>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(ReviewLike)
    private readonly reviewLikeRepository: Repository<ReviewLike>,
    @InjectRepository(CommentDislike)
    private readonly commentDislikeRepository: Repository<CommentDislike>,
    @InjectRepository(ReviewDislike)
    private readonly reviewDislikeRepository: Repository<ReviewDislike>,
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
      courseInfo.reviews = [];
      courseInfo.comments = [];
      await this.courseInfoRepository.save(courseInfo);
    }
    return courseInfo;
  }
  async createComment(
    courseId: number,
    authorId: number,
    content: string,
  ): Promise<void> {
    if (content === '')
      throw new BadRequestException('Comment cannot be empty');
    const courseInfo = await this.getCourseInfo(courseId);
    if (!courseInfo)
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    const comment = this.commentRepository.create({
      authorId: authorId,
      content: content,
      courseInfo: courseInfo,
    });
    await this.commentRepository.save(comment);
  }
  async editComment(
    commentId: number,
    userId: number,
    content: string,
  ): Promise<void> {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    if (comment.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    comment.content = content;
    await this.commentRepository.save(comment);
  }
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    if (comment.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    await this.commentRepository.delete(commentId);
  }
  async likeComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne(commentId);
    await this.checkLikeCondition(comment, commentId, userId);

    await this.commentLikeRepository.save(
      this.commentLikeRepository.create({ comment: comment, authorId: userId }),
    );
  }
  async dislikeComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne(commentId);
    await this.checkLikeCondition(comment, commentId, userId);

    await this.commentDislikeRepository.save(
      this.commentDislikeRepository.create({
        comment: comment,
        authorId: userId,
      }),
    );
  }
  async createReview(
    courseId: number,
    authorId: number,
    content: string,
  ): Promise<void> {
    if (content === '') throw new BadRequestException('Review cannot be empty');
    const courseInfo = await this.getCourseInfo(courseId);
    if (!courseInfo)
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    const review = this.reviewRepository.create({
      authorId: authorId,
      content: content,
      courseInfo: courseInfo,
    });
    await this.reviewRepository.save(review);
  }
  async editReview(
    commentId: number,
    userId: number,
    content: string,
  ): Promise<void> {
    const review = await this.reviewRepository.findOne(commentId);
    if (!review)
      throw new NotFoundException(`Review with ID ${commentId} not found`);
    if (review.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    review.content = content;
    await this.reviewRepository.save(review);
  }
  async deleteReview(commentId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne(commentId);
    if (!review)
      throw new NotFoundException(`Review with ID ${commentId} not found`);
    if (review.authorId !== userId)
      throw new ForbiddenException('You are not the author of this comment');
    await this.reviewRepository.delete(commentId);
  }
  async likeReview(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne(reviewId);
    await this.checkLikeCondition(review, reviewId, userId);

    await this.reviewLikeRepository.save(
      this.reviewLikeRepository.create({ review: review, authorId: userId }),
    );
  }
  async dislikeReview(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne(reviewId);
    await this.checkLikeCondition(review, reviewId, userId);

    await this.reviewDislikeRepository.save(
      this.reviewDislikeRepository.create({
        review: review,
        authorId: userId,
      }),
    );
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

    let likesAndDislikes: Like[] | Dislike[];

    if (target instanceof Comment) {
      likesAndDislikes = await this.likeRepository.find({
        where: { comment: target, authorId: userId },
      });
    } else if (target instanceof Review) {
      likesAndDislikes = await this.likeRepository.find({
        where: { review: target, authorId: userId },
      });
    }

    if (likesAndDislikes.length > 0)
      throw new ForbiddenException(
        'You have already liked or disliked this comment',
      );
  }
}
