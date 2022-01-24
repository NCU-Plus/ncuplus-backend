import { Entity, TableInheritance } from 'typeorm';
import { Like } from './like.entity';

@Entity('Dislikes')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Dislike extends Like {}
