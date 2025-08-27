import { Images } from '../entities/category';
import { CategoryStatus } from '../enums/category-status.enum';
import { CategoryTypes } from '../enums/category-types.enums';

export class CategoryKafkaDto {
  name?: string;
  nameAr?: string;
  position?: number;
  type?: CategoryTypes;
  status?: CategoryStatus;
  parentId?: string;
  images?: Images[] = [];
  maxPercentage?: number;
  currentPrice?: number;
}
