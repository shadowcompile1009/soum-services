import { IsString } from 'class-validator';

export class HyperPayLoginResDto {
  @IsString()
  accessToken: string;
  @IsString()
  message: string;
}
