import { ApiProperty } from '@nestjs/swagger';
import { InspectionStatus } from '../enum/inspection.status.enum';
import { ProductStatus } from '@src/modules/product/enum/productStatus.enum';
import { Category } from '@src/modules/product/entity/category.entity';
import { SoumUser } from '@src/modules/product/entity/user.entity';
import { ProductImageSection } from '@src/modules/product/entity/productImageSection.entity';
import { Product } from '@src/modules/product/entity/product.entity';

export class OrderInfo {
  @ApiProperty()
  
  id?: string;

  @ApiProperty()
  soumNumber: string;
}

export class ProductInspectionListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  sellPrice: number;

  @ApiProperty({ enum: InspectionStatus })
  inspectionStatus: InspectionStatus;

  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @ApiProperty({ type: SoumUser })
  user: SoumUser;

  @ApiProperty({ type: [Category] })
  categories: Category[];

  @ApiProperty({ type: 'object' })
  storageLocation: {
    BIN: string;
    storageNumber: string;
  };

  @ApiProperty({ type: [ProductImageSection] })
  images: ProductImageSection[];

  @ApiProperty({ type: OrderInfo })
  order: OrderInfo;

  @ApiProperty()
  updatedAt: Date;
}
