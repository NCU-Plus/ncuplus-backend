import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Profile } from './profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
