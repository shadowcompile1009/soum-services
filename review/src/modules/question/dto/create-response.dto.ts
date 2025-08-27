import { IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class AnswerDto {
  @IsString()
  @IsOptional()
  optionEn: string;

  @IsString()
  @IsOptional()
  optionAr: string;

  @IsString()
  @IsOptional()
  attachmentUrl: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsNumber()
  @IsOptional()
  score: number;
}

export class ResponseDto {
  @IsString()
  questionId: string;

  @IsString()
  version: number;

  answers: AnswerDto[];
}

export class CreateResponseDto {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  productId: string;

  @IsOptional()
  responses?: ResponseDto[];
}

export class ResponseWithScoreDto {
  @IsString()
  @IsOptional()
  _id?: mongoose.Types.ObjectId;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  productId: string;

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsString()
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  responses?: ResponseDto[];
}
