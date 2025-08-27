import { CategoryType } from '../enum/categoryType.enum';
import { ProductImageSectionDto } from './productImages.dto';

export class UserDeepLoad {
  id: any;
  name: any;
  isKeySeller: boolean;
  mobileNumber: any;
}

export class CategoryDeepLoad {
  type: CategoryType;
  name: any;
}

export class ProductDeepLoadDto {
  constructor() {
    this.categories = null;
    this.seller = null;
    this.imageSections = [];
    this.stockImages = [];
  }
  stockImages: ProductImageSectionDto[];
  imageSections: ProductImageSectionDto[];
  seller: UserDeepLoad;
  categories: CategoryDeepLoad[];
}
