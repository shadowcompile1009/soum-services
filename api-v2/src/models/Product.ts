// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
import { Constants } from '../constants/constant';

export interface ProductInput {
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
  grade_ar?: string;
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
  billingSettings?: BillingSettings;
}

export interface BillingSettings {
  buyer_commission_percentage: number;
  seller_commission_percentage: number;
  shipping_charge_percentage: number;
  vat_percentage: number;
  referral_discount_type: string;
  referral_percentage: number;
  referral_fixed_amount: number;
  delivery_threshold: number;
  apply_delivery_fee: boolean;
  delivery_fee: number;
  price_quality_extra_commission: number;
  activate_bidding?: boolean;
  available_payment_bidding?: string;
  config_bid_settings?: string;
  start_bid?: number;
  highest_bid?: number;
}

export interface ProductDocument extends Document {
  product_name: string;
  product_name_ar: string;
  status: string;
  active: boolean;
  current_price: number;
  discount: number;
  sell_price: number;
  bid_price: number;
  current_bid_price: number;
  product_images: string[];
  score: number;
  grade: string;
  grade_ar: string;
  brand: string;
  category: string;
  model_type: string;
  seller: string;
  questionnaire: string;
  color: string;
  variant: string;
  code: string;
  promo_code: string;
  response: string;
  specification: string;
  followed_users: IFollowedUser[];
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
  billingSettings: BillingSettings;
}

export interface IFollowedUser {
  follower_id: string;
  username: string;
  role: string;
}

const followedUserSchema: Schema = new Schema({
  follower_id: { type: String },
  username: { type: String },
  role: { type: String },
});

const productSchema: Schema = new Schema(
  {
    product_name: { type: String, unique: true, sparse: true },
    product_name_ar: { type: String, unique: true, sparse: true },
    status: { type: String, default: Constants.DEFINE_STATUS.PRODUCT.DRAFT },
    active: { type: Boolean },
    current_price: { type: Number },
    bidding: { type: Array, default: [] },
    code: { type: String },
    discount: { type: Number },
    sell_price: { type: Number },
    bid_price: { type: Number },
    current_bid_price: { type: Number },
    product_images: [{ type: String, default: '' }],
    score: { type: Number },
    grade: { type: String },
    grade_ar: { type: String },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    model_type: { type: Schema.Types.ObjectId, ref: 'DeviceModel' },
    questionnaire: { type: Schema.Types.ObjectId, ref: 'Questionnaire' },
    color: { type: Schema.Types.ObjectId, ref: 'Color' },
    variant: { type: Schema.Types.ObjectId, ref: 'Variant' },
    promo_code: { type: Schema.Types.ObjectId, ref: 'PromoCode' },
    response: { type: Schema.Types.ObjectId, ref: 'Response' },
    specification: { type: String },
    followed_users: [followedUserSchema],
    last_edited_state: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    deleted_date: { type: Date },
    billingSettings: {
      type: Object,
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals
  }
);

productSchema.virtual('askSeller', {
  ref: 'AskSeller',
  localField: '_id',
  foreignField: 'product_id',
  justOne: false,
  options: { sort: { created_date: -1 }, limit: 5 },
});

export const Product: Model<ProductDocument> = model<ProductDocument>(
  'Product',
  productSchema,
  'Product'
);
