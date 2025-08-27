// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import { AttributeOption } from './Attribute';

export interface VariantDocument extends Document {
  category_id: any;
  brand_id: any;
  model_id: any;
  varient: string;
  varient_ar: string;
  current_price: number;
  position?: number;
  status?: string;
  attributes?: AttributeVariantDocument[];
  migration_source?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_date?: Date;
  model_migration_source?: string;
  model_variant_map_id?: any;
}

export type VariantForProduct = {
  id: any;
  varient_ar: string;
  varient: string;
  attributes: FeatureForProduct[];
  conditions?: any;
  current_price?: number;
};

export type FeatureForProduct = {
  attribute_name_ar: string;
  attribute_name_en: string;
  option: AttributeOption[];
};

export interface AttributeVariantDocument extends Document {
  feature_id: string;
  attribute_id: string;
}

// attributes schema
export const attributesSchema = new Schema<AttributeVariantDocument>({
  feature_id: { type: String },
  attribute_id: { type: String },
});

const variantSchema = new Schema<VariantDocument>({
  category_id: { type: Schema.Types.ObjectId, ref: 'categories' },
  brand_id: { type: Schema.Types.ObjectId, ref: 'brands' },
  model_id: { type: Schema.Types.ObjectId, ref: 'device_models' },
  varient: { type: String },
  varient_ar: { type: String, default: '' },
  current_price: { type: Number },
  position: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  attributes: [attributesSchema],
  migration_source: { type: String },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_date: { type: Date },
  model_variant_map_id: { type: Schema.Types.ObjectId },
  model_migration_source: { type: String },
});

export const Variant: Model<VariantDocument> = model(
  'varients',
  variantSchema,
  'varients'
);
