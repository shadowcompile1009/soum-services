// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export class AttributeOption {
  option_name_en: string;
  option_name_ar: string;
  id?: string;
}

export type AttributeDocument = Document & {
  attribute_name_en: string;
  attribute_name_ar: string;
  status?: string;
  options: AttributeOption[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

const attributeSchema = new Schema<AttributeDocument>({
  attribute_name_en: { type: String },
  attribute_name_ar: { type: String },
  options: { type: Array, default: [], Element: AttributeOption },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date },
});

export const Attribute: Model<AttributeDocument> = model(
  'Attribute',
  attributeSchema,
  'Attribute'
);
