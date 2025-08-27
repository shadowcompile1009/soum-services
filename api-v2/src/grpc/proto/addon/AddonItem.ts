// Original file: node_modules/soum-proto/proto/addon.proto

export interface AddonItem {
  id?: string;
  status?: string;
  type?: string;
  image?: string;
  nameEn?: string;
  nameAr?: string;
  taglineAr?: string[];
  taglineEn?: string[];
  descriptionEn?: string;
  descriptionAr?: string;
  priceType?: string;
  price?: number | string;
  validityType?: string;
  validity?: number;
  modelIds?: string[];
  sellerIds?: string[];
}

export interface AddonItem__Output {
  id: string;
  status: string;
  type: string;
  image: string;
  nameEn: string;
  nameAr: string;
  taglineAr: string[];
  taglineEn: string[];
  descriptionEn: string;
  descriptionAr: string;
  priceType: string;
  price: number;
  validityType: string;
  validity: number;
  modelIds: string[];
  sellerIds: string[];
}
