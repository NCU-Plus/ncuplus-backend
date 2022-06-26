import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'default')
    private userRepository: Repository<User>,
  ) {}
  async getUserByPortalId(protalId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'portalId', 'identifier'],
      where: {
        portalId: protalId,
      },
    });
    return user;
  }
  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne(id, {
      select: ['id'],
    });
  }
  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: ['id'],
    });
    return users;
  }
  async createUser(
    portalId: number,
    identifier: string,
    studentId: string,
  ): Promise<User> {
    const profile = new Profile();
    profile.name = studentId;
    const user = this.userRepository.create({
      portalId: portalId,
      identifier: identifier,
      profile,
      studentId: studentId,
    });
    return await this.userRepository.save(user);
  }
}
