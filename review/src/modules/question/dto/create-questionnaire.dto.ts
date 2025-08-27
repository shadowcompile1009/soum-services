import { IsOptional, IsString } from "class-validator";

export class CreateQuestionnaireDto {
  @IsString()
  descriptionEn: string;

  @IsString()
  descriptionAr: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  categoryName: string;

  @IsOptional()
  questions: any[];
}
