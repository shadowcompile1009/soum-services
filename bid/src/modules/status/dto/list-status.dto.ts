import { IsMongoId, IsString } from 'class-validator';

export class ListStatusDto {
  @IsMongoId()
  id: string;

  @IsString()
  name: string;

  @IsString()
  displayName: string;
}
