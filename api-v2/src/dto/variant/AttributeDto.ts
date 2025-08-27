export class AttributeDto {
  featureId: string;
  attributeId: string;
  nameAr?: string;
  nameEn?: string;
  options?: OptionAttributeDto[];
}

export class OptionAttributeDto {
  id?: string;
  nameAr?: string;
  nameEn?: string;
}

export class FilterableAttribute {
  id?: string;
  attributeName: string;
  attributeNameAr: string;
}

export class BaseAttributeDto {
  id?: string;
  nameAr?: string;
  nameEn?: string;
  options?: OptionAttributeDto[];
}
