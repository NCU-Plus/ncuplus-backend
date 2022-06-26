import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

export enum UserRole {
  STUDENT = 0,
  TEACHER = 1,
  ADMIN = 2,
}

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  portalId: number;

  @Column()
  identifier: string;

  @Column()
  studentId: string;

  @Column('tinyint')
  role: UserRole;

  @OneToOne(() => Profile, { cascade: true, eager: true })
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
