import { AttributeDto } from './AttributeDto';

export class CreateVarientDto {
  categoryId: string;
  brandId: string;
  modelId: string;
  varientEn: string;
  varientAr: string;
  currentPrice: number;
  attributes: AttributeDto[];
}
