import { IsString, IsOptional, IsInt } from 'class-validator';

export class BasePromoCodeGenerationTaskDto {
  @IsInt()
  totalPromos: number;

  @IsString()
  parentPromoCodeId: string;
}

export class WritePromoCodeGenerationTaskDto extends BasePromoCodeGenerationTaskDto {
  @IsString()
  @IsOptional()
  id?: string;
}
