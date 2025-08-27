export type HotDealsId = string;

export interface HotDeals {
  arName: string;
  enName: string;
  id: string;
  items: HotDealsItem[];
}

export interface HotDealsItem {
  arGrade: string;
  arModelName: string;
  arVariantName: string;
  discount: number;
  grade: string;
  grandTotal: number;
  modelName: string;
  originalPrice: number;
  productId: string;
  productImage: string;
  sellPrice: number;
  variantName: string;
}
