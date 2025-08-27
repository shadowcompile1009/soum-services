// @ts-nocheck
import {
  Document,
  model,
  Model,
  Schema,
  SchemaTimestampsConfig,
  Types,
} from 'mongoose';
import { attributesSchema, AttributeVariantDocument } from './Variant';

export interface UpdateVariantInput {
  variant_id: Types.ObjectId;
  current_name_en: string;
  current_name_ar: string;
  current_attributes: AttributeVariantDocument[];
  update_name_en?: string;
  update_name_ar?: string;
  update_attributes?: AttributeVariantDocument[];
}

export interface UpdateVariantDocument
  extends Document,
    SchemaTimestampsConfig {
  variant_id: Types.ObjectId;
  current_name_en: string;
  current_name_ar: string;
  current_attributes: AttributeVariantDocument[];
  update_name_en?: string;
  update_name_ar?: string;
  update_attributes?: AttributeVariantDocument[];
}
export const updateVariantSchema: Schema<UpdateVariantDocument> =
  new Schema<UpdateVariantDocument>(
    {
      variant_id: { type: Schema.Types.ObjectId, require: true },
      current_name_en: { type: String, required: true },
      current_name_ar: { type: String, required: true },
      current_attributes: [attributesSchema],
      update_name_en: { type: String },
      update_name_ar: { type: String },
      update_attributes: [attributesSchema],
    },
    {
      timestamps: true,
    }
  );
export const UpdateVariant: Model<UpdateVariantDocument> =
  model<UpdateVariantDocument>(
    'UpdateVariant',
    updateVariantSchema,
    'UpdateVariant'
  );
