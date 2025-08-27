import { IsOptional } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends CreateQuestionDto {
  @IsOptional()
  version: number;
  @IsOptional()
  keepVersion: boolean;
}
