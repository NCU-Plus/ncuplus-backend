import { Column, Entity, OneToMany } from 'typeorm';
import { Content } from './content.entity';
import { Reaction } from './reaction.entity';

@Entity('Comments')
export class Comment extends Content {
  @Column()
  content: string;

  @OneToMany(() => Reaction, (reaction) => reaction.comment, { eager: true })
  reactions: Reaction[];
}
