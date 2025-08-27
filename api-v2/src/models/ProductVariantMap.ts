// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface ImportingVariantInput {
  _id: string;
  category_id: string;
  brand_id: string;
  model_id: string;
  old_variant_id: string;
  category_name: string;
  brand_name: string;
  model_name: string;
  variant_name: string;
  new_variant_id: string;
  new_model_id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
export type ProductVariantMap = Document & {
  category_id: string;
  brand_id: string;
  model_id: string;
  old_variant_id: string;
  category_name: string;
  brand_name: string;
  model_name: string;
  variant_name: string;
  new_variant_id: string;
  new_model_id: string;
  related_products: any[];
  related_variants: any[];
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type MappingArray = Document & {
  model_id: string;
  new_model_id: string;
  old_variant_id: string;
  new_variant_id: string;
};

const productVariantMapSchema = new Schema<ProductVariantMap>({
  category_id: { type: String },
  brand_id: { type: String },
  model_id: { type: String },
  old_variant_id: { type: String },
  category_name: { type: String },
  brand_name: { type: String },
  model_name: { type: String },
  variant_name: { type: String },
  new_variant_id: { type: String },
  new_model_id: { type: String },
  related_products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
  related_variants: [{ type: Schema.Types.ObjectId, ref: 'varients' }],
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date },
});

export const ProductVariant: Model<ProductVariantMap> = model(
  'VariantMap',
  productVariantMapSchema,
  'VariantMap'
);
