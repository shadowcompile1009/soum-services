import { AttributeDto } from './AttributeDto';

export class GetVarientDto {
  id: string;
  categoryId: string;
  brandId: string;
  modelId: string;
  varientEn: string;
  varientAr: string;
  currentPrice: number;
  position: number;
  status: string;
  deletedDate: Date;
  createdAt: Date;
  attributes: AttributeDto[];
  priceRanges?: any;
  timeTillSold?: any;
}
