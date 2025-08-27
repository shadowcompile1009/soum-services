import { ApiProperty } from '@nestjs/swagger';
export class ProductViewDto {
  @ApiProperty()
  readonly userId: string;
  @ApiProperty()
  readonly productId: string;
  @ApiProperty()
  readonly grandTotal: number;
  @ApiProperty()
  readonly viewedAt: Date;
  @ApiProperty()
  readonly createdAt: Date;
  @ApiProperty()
  readonly updatedAt: Date;
}
