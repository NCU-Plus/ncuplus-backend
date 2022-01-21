import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Departments')
export class Department {
  @PrimaryColumn({ unique: true })
  departmentId: string;

  @Column()
  departmentName: string;

  @PrimaryColumn()
  collegeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
