import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDTO } from '@src/modules/product/dto/createProduct.dto';
import { IsString, IsOptional } from 'class-validator';

export class CreateInspectionDTO extends CreateProductDTO {
  @ApiProperty({
    example: '66bde8a6c3fea800565de708',
    required: true,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: 'L12D',
    required: true,
  })
  @IsString()
  @IsOptional()
  BIN?: string;

  @ApiProperty({
    example: 'L12D',
    required: true,
  })
  @IsString()
  @IsOptional()
  storageNumber?: string;
}
