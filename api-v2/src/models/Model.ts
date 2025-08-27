// @ts-nocheck
import { Document, model, Model, PaginateModel, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export class ModelFilterOptions {
  limit?: number;
  migratedToCategory?: boolean;
}

export interface DeviceModelDocument extends Document {
  model_name?: string;
  model_name_ar?: string;
  category_id?: any;
  brand_id?: any;
  status?: string;
  model_icon?: string;
  position: number;
  positionPerCategory: number;
  totalAvailableProducts: number;
  migration_source?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  migrated_to_category: boolean;
}
export interface ModelSuggestion {
  id: string;
  model_name_suggestion?: string;
}
const modelSchema = new Schema<DeviceModelDocument>({
  category_id: { type: Schema.Types.ObjectId, ref: 'categories' },
  brand_id: { type: Schema.Types.ObjectId, ref: 'brands' },
  model_name: { type: String },
  model_name_ar: { type: String },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  migration_source: { type: String, default: '' },
  model_icon: { type: String },
  totalAvailableProducts: { type: Number, default: 0 },
  position: { type: Number, default: 0 },
  positionPerCategory: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
  migrated_to_category: { type: Boolean, default: false },
});

modelSchema.plugin(paginate);
export const DeviceModelPaginated: PaginateModel<DeviceModelDocument> = model(
  'device_models',
  modelSchema,
  'device_models'
) as any;

export const DeviceModel: Model<DeviceModelDocument> = model(
  'device_models',
  modelSchema,
  'device_models'
);
