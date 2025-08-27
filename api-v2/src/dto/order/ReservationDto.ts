import { CommissionSummaryResponse } from '../../grpc/proto/commission/CommissionSummaryResponse';

export class ReservationOrderDto {
  _id: string;
  order_id: string;
  order_number: string;
  seller_city: string;
  seller_id: string;
  seller_name: string;
  seller_countryCode: string;
  seller_mobile: string;
  product_id: string;
  sellPrice: string;
  modelId: string;
  variantId: string;
  grade: string;
  categoryId: string;
  categoryName: string;
  product_sell_price: string;
  modelName: string;
  modelNameAr: string;
  brandName: string;
  brandNameAr: string;
  productImages: string[];
  transaction_detail: number;
  buy_amount: number;
  grand_total: number;
  promo: { [key: string]: any };
  created_at: Date;
  updated_at: Date;
  isReservation: boolean;
  isFinancing: boolean;
  isFinancingEmailSent: boolean;
}

export class ReservationResponseDto {
  productName: string;
  productNameAr: string;
  orderId: string;
  imageUrl: string;
  reservationNumber: string;
  reservationDate: Date;
  productPriceSummary: CommissionSummaryResponse | null;
}

interface Promo {
  sellerPromocodeId: string;
  buyerPromocodeId: string;
}

interface BoughtHistoryModel {
  _id: string;
  model_name: string;
  model_name_ar: string;
}

interface BoughtHistoryProduct {
  _id: string;
  product_images: string[];
  model_id: BoughtHistoryModel;
}
export interface BoughtHistory {
  _id: string;
  transaction_status: string;
  order_number: string;
  dispute: string;
  buy_amount: number;
  promos: Promo;
  updated_at: Date;
  product: BoughtHistoryProduct;
}
