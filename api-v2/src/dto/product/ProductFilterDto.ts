import { ProductSortBy } from '../../enums/SortBy';
import { MppProductDto } from './MppProductDto';
export class ProductFilterDto {
  productIds?: string[];
  models: string[];
  deviceTypes: string[];
  capacities: string[];
  grades: string[];
  brands: string[];
  price: string;
  page: number;
  size: number;
  sortBy: ProductSortBy;
  userCity?: string;
  userId?: string;
  withPageInfo: boolean;
  highestBid?: number;
  tags?: string[];
  model_image: string;
  listingQuantity?: number;
  varients?: string[];
}
export class FilteredProductsDto extends MppProductDto {
  modelName: string;
  arModelName: string;
  start_bid?: number;
  highest_bid?: number;
  activate_bidding?: boolean;
}
