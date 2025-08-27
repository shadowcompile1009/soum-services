import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
