import { PartialType } from '@nestjs/mapped-types';
import { IsDate } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  id: string;

  @IsDate()
  updatedAt: Date;
}

export class RatingReviewDto {
  numberStars?: number;
  count: number;
  stars : number;
}