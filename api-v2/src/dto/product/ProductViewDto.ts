export class ProductViewDto {
  productId: string;
  grandTotal: number;
  userId: string;
  viewedAt: Date;
}
export class DeliveryRules {
  to: string;
  to_ar: string;
  min_expected_delivery_time: number;
  max_expected_delivery_time: number;
}

export class TopSellingProductDto {
  modelName: string;
  modelNameAR: string;
  modelIcon: string;
  varient: string;
  varientAR: string;
  totalSales: number;
  totalAmount: number;
}
