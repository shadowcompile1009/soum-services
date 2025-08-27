import { IsString } from 'class-validator';

export class GetStatusBySubmoduleDto {
  @IsString()
  submodule: string;
}
