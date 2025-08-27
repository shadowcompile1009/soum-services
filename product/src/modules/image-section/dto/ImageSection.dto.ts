import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ImageSectionDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1111' })
  id?: string;
  @IsString()
  @ApiProperty({ example: '1111' })
  categoryId: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Floor Plan' })
  sectionType: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'مخطط العقار' })
  sectionTypeAr: string;
  @IsString()
  @ApiProperty({ example: 'Some section info' })
  description?: string;
  @IsString()
  @ApiProperty({ example: 'معلومات عن القسم' })
  descriptionAr?: string;
  @IsString()
  @ApiProperty({ example: 'Main room section' })
  header?: string;
  @IsString()
  @ApiProperty({ example: 'الغرفه الرئيسيه' })
  headerAr?: string;
  @IsNumber()
  @ApiProperty({ example: 1 })
  minImageCount?: number;
  @IsNumber()
  @ApiProperty({ example: 10 })
  maxImageCount?: number;
  @IsBoolean()
  @ApiProperty({ example: false })
  isActive?: boolean;
  @IsString()
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
  @ApiProperty({ example: false })
  @IsOptional()
  createdAt?: Date;
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  position?: number;
}
