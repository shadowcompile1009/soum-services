// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface URLPathInput {
  relativePath?: string;
}
export interface ProductImageSectionInput {
  sectionId?: string;
  urls?: URLPathInput[];
}

export interface ListingGroupInput {
  condition_id?: any;
  user_id?: string;
  category_id?: string;
  brand_id?: string;
  model_id?: string;
  product_images?: string[];
  variant?: string;
  variant_id?: string;
  variant_ar?: string;
  sell_price?: number;
  score?: number;
  status?: string;
  updated_date?: Date;
  created_date?: Date;
  deleted_date?: Date;
  deleted_by?: string;
  quantity?: number;
  active_listing?: string;
  isModelImage?: boolean;
  presetCondition?: string;
  description?: string;
  isUsingLegacyUpload?: boolean;
  productImageSections?: ProductImageSectionInput[];
  inventoryId?: string;
}

export interface ListingGroupDocument extends Document {
  user_id?: string;
  category_id?: string;
  brand_id?: string;
  model_id?: string;
  product_images?: string[];
  variant?: string;
  variant_id?: string;
  variant_ar?: string;
  sell_price?: number;
  score?: number;
  status?: string;
  updated_date?: Date;
  created_date?: Date;
  deleted_date?: Date;
  deleted_by?: string;
  quantity?: number;
  active_listing?: string;
  isModelImage: boolean;
  condition_id?: string;
  description?: string;
}

const listingGroupSchema = new Schema<ListingGroupDocument>({
  user_id: { type: Schema.Types.ObjectId },
  category_id: { type: Schema.Types.ObjectId },
  brand_id: { type: Schema.Types.ObjectId },
  model_id: { type: Schema.Types.ObjectId },
  product_images: { type: Schema.Types.Array },
  variant: { type: String },
  variant_id: { type: Schema.Types.ObjectId },
  variant_ar: { type: String },
  sell_price: { type: Number },
  score: { type: Number },
  status: { type: String, enum: ['Active', 'Delete'], default: 'Active' },
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
  deleted_by: { type: String },
  quantity: { type: Number },
  active_listing: { type: Schema.Types.ObjectId },
  isModelImage: { type: Boolean, default: true },
  condition_id: { type: String },
  description: { type: String },
});

export const ListingGroup: Model<ListingGroupDocument> =
  model<ListingGroupDocument>(
    'ListingGroup',
    listingGroupSchema,
    'ListingGroup'
  );
