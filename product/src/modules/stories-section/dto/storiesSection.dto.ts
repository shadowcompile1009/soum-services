import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterStoryDto {
  @ApiProperty({ example: 'admin/mobile' })
  @IsOptional()
  @IsString()
  public clientId?: string;
  @ApiProperty({ example: '2024-09-17 11:56:58+00' })
  @IsOptional()
  date?: Date;
  @ApiProperty({ example: 'searching' })
  @IsOptional()
  search?: string;
}

export class StoryURLData {
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

export class StoriesSectionDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1111' })
  id?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Some section info' })
  nameEn?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'معلومات عن القسم' })
  nameAr?: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  isActive?: boolean;
  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['https://soum.sa/image.png'] })
  storyURLs?: StoryURLData[];
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://soum.sa/image.png' })
  iconURL?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://soum.sa/image.png' })
  urlLink?: string;
  @ApiProperty({ example: '2024-09-17 11:56:58+00' })
  @IsOptional()
  createdAt?: Date;
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  position?: number;
  @ApiProperty({ example: '2024-09-17 11:56:58+00' })
  @IsOptional()
  startDate?: Date;
  @ApiProperty({ example: '2024-09-17 11:56:58+00' })
  @IsOptional()
  endDate?: Date;
}
