import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile, 'default')
    private profileRepository: Repository<Profile>,
  ) {}

  async findById(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne(id);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async createProfile(
    createProfileDto: CreateProfileDto,
    user: User,
  ): Promise<Profile> {
    const saved = await this.profileRepository.save(
      this.profileRepository.create({
        ...createProfileDto,
        user,
      }),
    );
    return saved;
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findById(id);
    const saved = await this.profileRepository.save({
      ...profile,
      ...updateProfileDto,
    });
    return saved;
  }
}