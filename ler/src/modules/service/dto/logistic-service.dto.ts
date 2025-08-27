import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class LogisticServiceDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;
  @IsString()
  @IsNotEmpty()
  vendorId: string;
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  dmoId: string;
  serviceName?: string;
}
