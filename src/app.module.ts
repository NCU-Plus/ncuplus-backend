import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Course } from './course/course.entity';
import { College } from './course/college.entity';
import { Department } from './department/department.entity';
import { DepartmentModule } from './department/department.module';

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
          entities: [],
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
    CourseModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
