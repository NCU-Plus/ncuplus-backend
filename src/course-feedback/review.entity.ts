import { Column, Entity, OneToMany } from 'typeorm';
import { Content } from './content.entity';
import { Reaction } from './reaction.entity';

@Entity('Reviews')
export class Review extends Content {
  @Column('text')
  content: string;

  @OneToMany(() => Reaction, (reaction) => reaction.review, { eager: true })
  reactions: Reaction[];
}
