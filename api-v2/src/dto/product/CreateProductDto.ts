export class CreateProductDto {
  product_name?: string;
  product_name_ar?: string;
  status?: string;
  active?: boolean;
  current_price?: number;
  discount?: number;
  sell_price?: number;
  bid_price?: number;
  current_bid_price?: number;
  product_images?: string[];
  score?: number;
  grade?: string;
  brand_id?: string;
  category_id?: string;
  model_id?: string;
  seller?: string;
  questionnaire_id?: string;
  color_id?: string;
  variant_id?: string;
  code?: string;
  promo_code?: string;
  response_id?: string;
  specification?: string;
}
