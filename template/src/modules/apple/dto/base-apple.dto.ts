import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseAppleDto {
  @IsString()
  @IsOptional()
  color: string;

  @IsNumber()
  price: number;
}
