import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  name: string;
}
