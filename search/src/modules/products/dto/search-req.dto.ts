import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class FiltersDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'iphone' })
  q: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'modelName' })
  query_by: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'sort_score:asc' })
  sort_by: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'sellPrice:>100' })
  filter_by: string;
}

export class SearchReqDTO {
  @IsObject()
  @ApiProperty({
    isArray: false,
    type: FiltersDTO,
    description: 'search string',
  })
  filters: FiltersDTO;
}
