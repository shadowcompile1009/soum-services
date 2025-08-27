import { ApiProperty } from '@nestjs/swagger';

export class BestListingSettingsResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '60661c60fdc090d1ce2d4914',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Mobiles',
  })
  categoryName: string;

  @ApiProperty({
    description: 'Best listing variants in English',
    example: ['Capacity'],
    isArray: true,
  })
  bestListingVariantsEn: string[];

  @ApiProperty({
    description: 'Best listing variants in Arabic',
    example: ['السعة'],
    isArray: true,
  })
  bestListingVariantsAr: string[];

  @ApiProperty({
    description: 'Number of items to retrieve',
    example: 3,
  })
  retrieveUpTo: number;
}
