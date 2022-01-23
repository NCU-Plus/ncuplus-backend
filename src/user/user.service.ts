import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const users = await this.userRepository.find({
      select: ['id', 'portalId', 'identifier', 'name'],
      where: {
        portalId: protalId,
      },
    });
    if (users.length === 0) throw new UnauthorizedException("Can't find user.");
    return users[0];
  }
  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
