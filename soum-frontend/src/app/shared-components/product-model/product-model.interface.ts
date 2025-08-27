// TODO refactor v1
export interface Product {
  answer_to_questions: string;
  answer_to_questions_ar: string;
  answer_to_questions_ar_migration: string;
  answer_to_questions_migration: string;
  bid_price: number;
  bid_text: string;
  body_cracks: string;
  brand_id: string;
  brands: {
    brand_icon: string;
    brand_name: string;
    brand_name_ar: string;
  };
  category: {
    category_name_ar: string;
    category_name: string;
  };
  category_id: string;
  code: string;
  createdDate: string;
  current_bid_price: number;
  defected_images: Array<string>;
  description: string;
  discount: string;
  expiryDate: string;
  favourited: boolean;
  favourited_by: [];
  grade: string;
  grade_ar: string;
  isListedBefore: false;
  model_id: string;
  modelName: string;
  arModelName: string;
  models: {
    current_price: number;
    model_icon: string;
    model_name: string;
    model_name_ar: string;
  };
  product_id: string;
  product_images: Array<string>;
  score: number;
  sell_price: 10;
  sell_status: string;
  seller_id: string;
  seller_name: string;
  status: string;
  user_id: string;
  varient: string;
  varient_id: string;
  varients: { varient: string };
  _id: string;
}
