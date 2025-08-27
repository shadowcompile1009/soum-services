import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsOptional()
  questionnaireId: string;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsOptional()
  questionId: string;

  @IsString()
  questionEn: string;

  @IsString()
  questionAr: string;

  @IsString()
  questionType: string;

  @IsString()
  @IsOptional()
  placeholderTextEn: string;

  @IsString()
  @IsOptional()
  placeholderTextAr: string;

  @IsString()
  @IsOptional()
  subTextEn: string;

  @IsString()
  @IsOptional()
  subTextAr: string;

  @IsBoolean()
  @IsOptional()
  isMandatory: boolean;

  @IsOptional()
  status: string;

  @IsOptional()
  options: any;
}
