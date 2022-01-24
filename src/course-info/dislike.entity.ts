import { Entity, TableInheritance } from 'typeorm';
import { Like } from './like.entity';

export abstract class Dislike extends Like {}
