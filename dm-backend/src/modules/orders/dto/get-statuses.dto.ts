import { IsMongoId, IsString } from 'class-validator';

export class GetStatusDto {
  @IsMongoId()
  dmOrderId: string;

  @IsString()
  submodule: string;
}
