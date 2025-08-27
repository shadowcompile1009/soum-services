import { IsString } from 'class-validator';

export class BaseStatusDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;
}
