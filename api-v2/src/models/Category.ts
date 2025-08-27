// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface CategoryInput {
  category_id?: string;
  category_name: string;
  category_name_ar: string;
  category_icon: string;
  listing_photo?: string;
  browsing_photo?: string;
  active: boolean;
  status?: string;
  position: number;
  max_percentage?: number;
  parent_super_category_id?: string;
}

export type CategoryDocument = Document & {
  category_name: string;
  category_name_ar: string;
  category_icon: string;
  mini_category_icon: string;
  listing_photo: string;
  browsing_photo: string;
  active: boolean;
  position: number;
  max_percentage: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  parent_super_category_id?: string;
};

const categorySchema = new Schema<CategoryDocument>({
  category_name: { type: String },
  category_name_ar: { type: String },
  category_icon: { type: String },
  mini_category_icon: { type: String, default: '' },
  listing_photo: { type: String, default: '' },
  browsing_photo: { type: String, default: '' },
  active: { type: Boolean },
  position: { type: Number, default: 0 },
  max_percentage: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  parent_super_category_id: { type: Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

export const Category: Model<CategoryDocument> = model<CategoryDocument>(
  'categories',
  categorySchema,
  'categories'
);
