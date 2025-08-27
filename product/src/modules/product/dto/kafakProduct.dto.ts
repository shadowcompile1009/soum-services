import { Settings } from 'http2';
import { StatusSummary } from '../entity/product.entity';
import { ProductSellType } from '../enum/productSellType.enum';
import { ProductStatus } from '../enum/productStatus.enum';
import { Category, ListingAddress } from './createProduct.dto';
import { ProductImageSection } from '../entity/productImageSection.entity';
import { ListingSource } from '../enum/listingSource.enum';

export class kafkaProductDto {
  id?: string;
  description?: string;
  userId?: string;
  score?: number;
  sellPrice: number;
  imagesUrl?: string[];
  status?: ProductStatus;
  sellerPromoCodeId?: string;
  sellType?: ProductSellType;
  listingSource: ListingSource;
  //   groupListingId?: string;
  categories?: Category[];
  statusSummary?: StatusSummary;
  listingAddress?: ListingAddress;
  recommended_price?: number;
  //   productSetting: Settings;
  //   productImageSections?: ProductImageSection[];
  //   createdAt: Date;
  //   updatedAt?: Date;
}
