import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class StockImageDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1111', description: 'Unique identifier of the stock image' })
  id?: string;

  @IsString()
  @ApiProperty({ example: '1111', description: 'Unique identifier of the model' })
  modelId: string;

  @IsString()
  @ApiProperty({ example: 'model Name', description: 'Name of the model' })
  modelName?: string;

  @IsString()
  @ApiProperty({ example: 'brand Name', description: 'Name of the brand' })
  brandName?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2023, description: 'Release year of the model', type: Number })
  releaseYear?: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ['https://soum.sa/image1.png', 'https://soum.sa/image2.png'],
    description: 'Array of image URLs',
    isArray: true,
    items: { type: 'string', example: 'https://soum.sa/image.png' },
  })
  urls?: string[];

  @IsDate()
  @IsOptional()
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt?: Date;
}
