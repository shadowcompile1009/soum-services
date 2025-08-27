// @ts-nocheck
import { Document, model, Model, PaginateModel, Schema, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ListingSource } from '../enums/ListingSource';
import { ProductOrderStatus } from '../enums/ProductStatus.Enum';
import { TradeInStatus } from '../enums/TradeInStatus';
import { DeviceModelDocument } from '../models/Model';
import { BillingSettings } from './Product';
import { VariantForProduct } from './Variant';
export interface LegacyProductInput {
  _id?: Types.ObjectId;
  category_id?: string;
  brand_id?: string;
  model_id?: string;
  product_images?: string[];
  defected_images?: string[];
  varient?: string;
  varient_ar?: string;
  varient_id?: string;
  condition_id?: string;
  body_cracks?: string;
  sell_price?: number;
  bid_price?: number;
  description?: string;
  answer_to_questions?: string;
  answer_to_questions_ar?: string;
  grade?: string;
  grade_ar?: string;
  score?: number;
  previous_grade?: string;
  previous_score?: number;
  pick_up_address?: any;
  bidding?: [any];
  save_as_draft_step?: string;
  current_bid_price?: number;
  favourited_by?: [any];
  status?: string;
  sell_status?: string;
  response?: string;
  questionnaire_migration_status?: string;
  isApproved?: boolean;
  isExpired?: boolean;
  isListedBefore?: string;
  isFraudDetected?: boolean;
  verified_date?: Date;
  promocode?: string;
  expiryAfterInDays?: number;
  attributes?: [string];
  variant_attributes_selections?: [any];
  mismatch_model_migration?: string;
  billingSettings?: BillingSettings;
  recommended_price?: number;
  start_bid?: number;
  isBiddingProduct?: boolean;
  listingQuantity?: number;
  listingGroupId?: string;
  trade_in?: boolean;
  trade_in_status?: string;
  isModelImage?: boolean;
  listingSource?: string;
  auto_approve_at?: Date;
  listingAddress?: ListingAddress;
  inventoryId?: string;
  isConsignment?: boolean;
  consignment?: Consignment;
}
export interface Consignment {
  orderNumber?: string;
  payoutAmount?: number;
  payoutStatus?: string;
}

export interface LegacyProductType {
  _id?: string;
  user_id: string;
  category_id: string;
  brand_id: string;
  model_id: string;
  model: DeviceModelDocument;
  category?: any;
  brand?: any;
  product_images: string[];
  defected_images: string[];
  varient: string;
  varient_id: string;
  varient_ar: string;
  body_cracks: string;
  sell_price: number;
  bid_price: number;
  description: string;
  answer_to_questions: string;
  answer_to_questions_ar: string;
  answer_to_questions_migration: string;
  answer_to_questions_ar_migration: string;
  unansweredquestions: string;
  unmatchedquestions: string;
  grade: string;
  grade_ar: string;
  score: number;
  previous_grade: string;
  previous_score: number;
  pick_up_address: any;
  bidding: any;
  bid_data: any;
  current_bid_price: number;
  favourited_by: any;
  status: string;
  sell_status: string;
  response: string;
  questionnaire_migration_status: string;
  isApproved: boolean;
  isExpired: boolean;
  isListedBefore: boolean;
  code: string;
  discount: string;
  current_price: number;
  promocode: string;
  updatedDate: Date;
  createdDate: Date;
  expiryDate: Date;
  deletedDate: Date;
  deletedBy: string;
  highlights: [Types.ObjectId];
  attributes?: any;
  variant_attributes_selections?: [any];
  model_migration_source?: string;
  variant_migration_source?: string;
  model_variant_map_id?: any;
  rejected_reasons: string;
  rejected_timestamp: Date;
  billingSettings?: BillingSettings;
  recommended_price?: number;
  listingQuantity?: number;
  trade_in_status?: string;
  isModelImage?: boolean;
  listingSource?: string;
}

export interface ProductQuestion {
  product_questions: string[];
  product_questions_ar: string[];
}

export interface ProductListData {
  tags: string;
  grandTotal: number;
  variant: VariantForProduct;
}
export interface MatchCondition {
  _id?: Record<string, Array<unknown>>;
  sell_status?: string;
  status?: string;
  isApproved?: boolean;
  sell_price?: Record<string, number>;
  expiryDate?: Record<string, Date>;
  model_id?: Record<string, any>;
  category_id?: Record<string, any>;
  brand_id?: Record<string, Array<unknown>>;
  grade?: Record<string, string>;
  search_sync?: Record<string, any>;
  $or?: Array<Record<string, any>>;
  $and?: Array<Record<string, any>>;
}

export interface AnswerToQuestion {
  question: string;
  answer: string;
}

export interface ListingAddress {
  latitude?: string;
  longitude?: string;
  address?: string;
}

export interface ReportedBy {
  userId: string;
  reportedReason: string;
  reportedAt: Date;
}

export interface ILegacyProductModel extends Document {
  user_id: any;
  category_id: any;
  brand_id: any;
  model_id: any;
  product_images: string[];
  defected_images: string[];
  varient: string;
  varient_ar: string;
  varient_id: any;
  condition_id?: string;
  body_cracks: string;
  sell_price: number;
  bid_price: number;
  description: string;
  answer_to_questions: string;
  answer_to_questions_ar: string;
  answer_to_questions_migration: string;
  answer_to_questions_ar_migration: string;
  grade: string;
  grade_ar: string;
  score: number;
  previous_grade: string;
  previous_score: number;
  pick_up_address: any;
  bidding: [any];
  save_as_draft_step: string;
  current_bid_price: number;
  favourited_by: [any];
  status: string;
  sell_status: string;
  response: string;
  questionnaire_migration_status: string;
  isApproved: boolean;
  isExpired: boolean;
  isListedBefore: boolean;
  promocode: string;
  updatedDate: Date;
  createdDate: Date;
  expiryDate: Date;
  deletedDate: Date;
  deletedBy: string;
  highlights: [any];
  details?: any;
  attributes?: any;
  highlightsAdded?: string;
  reason?: string;
  isReported?: boolean;
  reportDescription?: string;
  reportedDate?: Date;
  reportedBy?: ReportedBy[];
  isFraudDetected?: boolean;
  verified_date?: Date;
  approve_source?: string;
  isVerifiedByAdmin?: boolean;
  verifiedAdmin: string;
  verifiedByAdminDate?: Date;
  isPriceUpdating?: boolean;
  priceUpdateTimestamp?: Date;
  variant_attributes_selections?: [any];
  model_migration_source?: string;
  variant_migration_source?: string;
  model_variant_map_id?: any;
  rejected_reasons: string;
  rejected_timestamp: Date;
  mismatch_model_migration?: string;
  billingSettings?: BillingSettings;
  search_sync?: string;
  recommended_price?: number;
  listingQuantity?: number;
  listingGroupId?: Types.ObjectId;
  trade_in?: boolean;
  trade_in_status?: string;
  image_updated?: Date;
  isModelImage?: boolean;
  listingSource?: string;
  isUpranked?: boolean;
  imagesQualityScore?: number;
  regaUrl: string;
  listingAddress?: ListingAddress;
  guaranteesUrl?: string;
  marketPercentage?: number;
  lastSyncDate?: Date;
  isConsignment?: boolean;
  consignment?: Consignment;
}

// @ts-nocheck
const productSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'user',
      index: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'categories',
      index: true,
    },
    brand_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'brands',
      index: true,
    },
    model_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'device_models',
      index: true,
    },
    product_images: [{ type: String, default: '' }],
    defected_images: [{ type: String, default: '' }],
    varient: { type: String, required: true },
    varient_id: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'varients',
      index: true,
    },
    condition_id: { type: String, required: false },
    varient_ar: { type: String, required: false },
    body_cracks: { type: String, enum: ['no', 'yes'], required: true },
    sell_price: { type: Number, required: true },
    bid_price: { type: Number, required: true },
    description: { type: String, default: '' },
    answer_to_questions: { type: String, default: '' },
    answer_to_questions_ar: { type: String, default: '' },
    answer_to_questions_migration: { type: String, default: '' },
    answer_to_questions_ar_migration: { type: String, default: '' },
    unansweredquestions: { type: String, default: '' },
    unmatchedquestions: { type: String, default: '' },
    grade: { type: String, default: '' },
    grade_ar: { type: String, default: '' },
    score: { type: Number, default: 0 },
    previous_grade: { type: String, default: '' },
    previous_score: { type: Number, default: 0 },
    pick_up_address: { type: Object, default: {} },
    bidding: { type: Array, default: [] },
    save_as_draft_step: { type: String, default: '' },
    current_bid_price: { type: Number, default: 0 },
    favourited_by: { type: Array, default: [] },
    status: {
      type: String,
      enum: ['Inactive', 'Active', 'Delete', 'On hold', 'Reject'],
      default: 'Active',
      index: true,
    },
    sell_status: {
      type: String,
      enum: ProductOrderStatus,
      default: 'Available',
    },
    response: { type: Schema.Types.ObjectId, ref: 'Response' },
    questionnaire_migration_status: { type: String, default: null },
    isApproved: { type: Boolean, default: true },
    isExpired: { type: Boolean, default: false },
    isFraudDetected: { type: Boolean, default: false },
    verified_date: { type: Date, default: null },
    isListedBefore: { type: Boolean, default: false },
    code: { type: String },
    promocode: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'promocodes',
    },
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date },
    expiryDate: {
      type: Date,
      default: () => {
        return new Date();
      },
    },
    deletedDate: { type: Date, index: true },
    deletedBy: { type: String },
    highlights: { type: Array, default: [] },
    attributes: [{ type: Schema.Types.ObjectId, ref: 'Attribute' }],
    highlightsAdded: { type: String, default: 'notRan' },
    reason: { type: String },
    isReported: { type: Boolean, default: false },
    reportDescription: { type: String },
    reportedDate: { type: Date },
    reportedBy: { type: Array, default: [] },
    approve_source: { type: String },
    isVerifiedByAdmin: { type: Boolean, default: false },
    verifiedAdmin: { type: Schema.Types.ObjectId, ref: 'user' },
    verifiedByAdminDate: { type: Date, default: Date.now },
    isPriceUpdating: { type: Boolean, default: false },
    priceUpdateTimestamp: { type: Date },
    variant_attributes_selections: { type: Array, default: [] },
    model_migration_source: { type: String },
    variant_migration_source: { type: String },
    model_variant_map_id: { type: Schema.Types.ObjectId },
    rejected_reasons: { type: String },
    rejected_timestamp: { type: Date },
    mismatch_model_migration: { type: String },
    billingSettings: { type: Object },
    search_sync: { type: String },
    recommended_price: { type: Number },
    isBiddingProduct: { type: Boolean, default: false },
    listingQuantity: { type: Number },
    listingGroupId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'ListingGroup',
      index: true,
    },
    trade_in: { type: Boolean, default: false },
    trade_in_status: { type: String, default: TradeInStatus.IN_PROGRESS },
    image_updated: { type: Date },
    isModelImage: { type: Boolean },
    listingSource: {
      type: String,
      enum: ListingSource,
      default: ListingSource.CONSUMER,
    },
    isUpranked: { type: Boolean, default: false },
    imagesQualityScore: { type: Number, default: 0 },
    regaURL: { type: String },
    guaranteesUrl: { type: String },
    listingAddress: { type: Object, default: null },
    inventoryId: { type: String },
    marketPercentage: { type: Number },
    lastSyncDate: { type: Date },
    isConsignment: { type: Boolean, default: false },
    consignment: { type: Object, default: null },
  },
  { strict: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('category', {
  ref: 'categories',
  localField: 'category_id',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('brand', {
  ref: 'brands',
  localField: 'brand_id',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('model', {
  ref: 'device_models',
  localField: 'model_id',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('variant', {
  ref: 'varients',
  localField: 'varient_id',
  foreignField: '_id',
});

productSchema.plugin(paginate);

productSchema.pre('updateOne', function () {
  this.set({ updatedDate: new Date() });
});

productSchema.pre('findOneAndUpdate', function () {
  this.findOneAndUpdate({}, { $set: { updatedDate: new Date() } });
});

productSchema.index({ createdDate: -1 });
productSchema.index({ image_updated: -1 });
export const ProductModelPaginated: PaginateModel<ILegacyProductModel> = model(
  'products',
  productSchema,
  'products'
) as any;
export const ProductModel: Model<ILegacyProductModel> =
  model<ILegacyProductModel>('products', productSchema, 'products');
