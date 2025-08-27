import { IsOptional, IsString } from 'class-validator';

export class MikroOrmIdDto {
  @IsString()
  productId: string;
  @IsString()
  @IsOptional()
  categoryName: string;
}
