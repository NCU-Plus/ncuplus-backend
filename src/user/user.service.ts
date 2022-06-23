import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'default')
    private userRepository: Repository<User>,
  ) {}
  async getUserByPortalId(protalId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'portalId', 'identifier', 'name'],
      where: {
        portalId: protalId,
      },
    });
    return user;
  }
  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne(id, {
      select: ['id', 'name'],
    });
  }
  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: ['id', 'name'],
    });
    return users;
  }
  async createUser(
    portalId: number,
    identifier: string,
    studentId: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      portalId: portalId,
      identifier: identifier,
      name: studentId,
      studentId: studentId,
    });
    return await this.userRepository.save(user);
  }
}
