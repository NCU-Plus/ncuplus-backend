import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Likes')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
