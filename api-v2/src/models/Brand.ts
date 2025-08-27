// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export class BrandFilterOptions {
  limit?: number;
  migratedToCategory?: boolean;
}
export interface BrandInput {
  brand_id?: string;
  category_id?: string;
  brand_name: string;
  brand_name_ar: string;
  brand_icon: string;
  status?: string;
  position: number;
  migrated_to_category?: boolean;
}
export interface AddOnBase {
  addOnName: string;
  addOnNameAr: string;
  addOnPrice: number;
  addOnIcon: string;
}

export interface AddOnInput extends AddOnBase {
  id: string;
}
export type AddOnUpdate = AddOnBase;
export interface AddOn extends AddOnBase {
  id: string;
}
export interface AddOnSummary {
  selectedAddOns?: AddOn[];
  addOns?: AddOn[];
  addOnsTotal: number;
  addOnsGrandTotal: number;
  addOnsVat: number;
}
export interface BrandDocument extends Document {
  category_id?: any;
  status?: string;
  brand_name?: string;
  brand_name_ar?: string;
  brand_icon?: string;
  position?: number;
  add_ons: AddOn[];
  is_add_on_enabled: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  migrated_to_category?: boolean;
}

const brandSchema: Schema<BrandDocument> = new Schema<BrandDocument>({
  brand_name: { type: String },
  brand_name_ar: { type: String },
  brand_icon: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: 'categories' },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  position: { type: Number, default: 0 },
  add_ons: { type: Array, default: [] },
  is_add_on_enabled: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
  migrated_to_category: { type: Boolean, default: false },
});

export const Brand: Model<BrandDocument> = model<BrandDocument>(
  'brands',
  brandSchema,
  'brands'
);
