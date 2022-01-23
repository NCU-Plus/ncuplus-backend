import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from '../course/course.service';
import { Repository } from 'typeorm';
import { CourseInfo } from './course-info.entity';
import { Comment } from './comment.entity';
import { Review } from './review.entity';

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
}
