import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class VectorDto {
  @IsString()
  @IsNotEmpty()
  data?: string;

  @IsString()
  @IsOptional()
  infer?: string;
}
