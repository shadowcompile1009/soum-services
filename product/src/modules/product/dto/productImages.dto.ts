import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class URLData {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  base: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  relativePath: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  fullURL?: string;
}
export class ProductImageSectionDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '111222' })
  id?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  description?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  descriptionAr?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Floor Plan' })
  sectionType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'مخطط العقار' })
  sectionTypeAr?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  header?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is new section' })
  headerAr?: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1 })
  minImageCount?: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1 })
  maxImageCount?: number;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '11111' })
  productId?: string;
  @IsArray()
  @ApiProperty()
  urls?: URLData[];
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '/image.png' })
  iconURL?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://soum.sa' })
  base?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://soum.sa/image.png' })
  fullURL?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '11111' })
  sectionId?: string;
}
