import { GetOptionItemDto } from './GetOptionItemDto';

export class AttributeDto {
  nameAr: string;
  nameEn: string;
  status?: string;
  options: GetOptionItemDto[];
}
