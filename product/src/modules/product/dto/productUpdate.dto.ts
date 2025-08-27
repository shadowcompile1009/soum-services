import { ProductStatus } from '../enum/productStatus.enum';
import { Category } from './createProduct.dto';
export class ProductUpdateDto {
  status?: ProductStatus;
  isApproved?: boolean;
  consignment?: Consignment;
  sellPrice?: number;
  categories?: Category[];
}
class Consignment {
  orderNumber?: string;
  payoutAmount?: number;
  payoutStatus?: string;
}
