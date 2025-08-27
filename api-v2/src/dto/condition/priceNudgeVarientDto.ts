export class PriceNudgeVarientDto {
  brand: string;
  model: string;
  variant: string;
  varientId: string;
  condition: string;
  marketPrice: number;
}

export class PriceNudgeVarientInputDto {
  varientId: string;
  condition: string;
  marketPrice: number;
  maxTransaction: number;
  deliveryFee: number;
  buyerCommission: number;
  vat: number;
}

export class NewPriceProductDto {
  variantId: string;
  newPrice: number;
}
