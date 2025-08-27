import { IsNumber, IsString } from 'class-validator';

export class CreateStatusGroupDto {
  @IsString()
  operatingModel: string;

  @IsString()
  statusName: string;

  @IsString()
  groupStatusName?: string;
}
