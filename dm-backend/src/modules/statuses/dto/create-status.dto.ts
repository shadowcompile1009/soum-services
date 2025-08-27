import { IsNumber, IsString } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  submodule?: string;

  @IsNumber()
  sequence: number;

  @IsString()
  id: string;

  @IsString()
  _id: string;
}
