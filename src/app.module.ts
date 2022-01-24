import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Course } from './course/course.entity';
import { College } from './college/college.entity';
import { Department } from './department/department.entity';
import { DepartmentModule } from './department/department.module';
import { CollegeModule } from './college/college.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { CourseInfoModule } from './course-info/course-info.module';
import { CourseInfo } from './course-info/course-info.entity';
import { Review } from './course-info/review.entity';
import { Comment } from './course-info/comment.entity';
import { CommentLike } from './course-info/comment-like.entity';
import { ReviewLike } from './course-info/review-like.entity';
import { Like } from './course-info/like.entity';
import { CommentDislike } from './course-info/comment-dislike.entity';
import { ReviewDislike } from './course-info/review-dislike.entity';
import { Dislike } from './course-info/dislike.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        ({
          ...config.get('db'),
          database: 'ncuplus',
          entities: [
            User,
            CourseInfo,
            Review,
            Comment,
            Like,
            CommentLike,
            ReviewLike,
            CommentDislike,
            ReviewDislike,
          ],
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'coursesConnection',
      useFactory: (config: ConfigService) =>
        ({
          ...config.get('db'),
          database: 'Course',
          entities: [College, Department, Course],
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    CollegeModule,
    DepartmentModule,
    CourseModule,
    AuthModule,
    UserModule,
    CourseInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
