// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface ImportingVariantInput {
  category_id: string;
  brand_id: string;
  model_id: string;
  varient: string;
  varient_ar: string;
  current_price: number;
  deleted_date: Date;
  attributes: any[];
  migration_source?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  like_new?: string;
  light_use?: string;
  good_condition?: string;
  extensive_use?: string;
  chipset?: string;
  sub_brand?: string;
  camera_model?: string;
  video_resolution?: string;
  resolution?: string;
  sensor_type?: string;
  iso?: string;
  continuous_shooting_rate?: string;
  year?: string;
  backlight?: string;
  screen_size?: string;
  model_type?: string;
  'speakers?'?: string;
  monitor_type?: string;
  speaker_type?: string;
  router_type?: string;
  first_letter?: string;
  second_letter?: string;
  third_letter?: string;
  car_model?: string;
  cylinders?: string;
  engine_displacement?: string;
  drive?: string;
  fuel_type?: string;
  transmission?: string;
  vehicle_size_class?: string;
  electric_motor?: string;
  car_mileage?: string;
  city?: string;
  neighborhood?: string;
  number_of_bedrooms?: string;
  number_of_bathrooms?: string;
  property_area?: string;
  timeTillSoldLikeNewFair?: string;
  timeTillSoldLikeNewExpensive?: string;
  timeTillSoldLikeNewExcellent?: string;
  timeTillSoldLightlyUsedFair?: string;
  timeTillSoldLightlyUsedExpensive?: string;
  timeTillSoldLightlyUsedExcellent?: string;
  timeTillSoldGoodConditionFair?: string;
  timeTillSoldGoodConditionExpensive?: string;
  timeTillSoldGoodConditionExcellent?: string;
  timeTillSoldExtensivelyUsedFair?: string;
  timeTillSoldExtensivelyUsedExpensive?: string;
  timeTillSoldExtensivelyUsedExcellent?: string;
  like_new_min_fair?: string;
  like_new_min_expensive?: string;
  like_new_min_excellent?: string;
  lightly_used_min_fair?: string;
  lightly_used_min_expensive?: string;
  lightly_used_min_excellent?: string;
  good_condition_min_fair?: string;
  good_condition_min_expensive?: string;
  good_condition_min_excellent?: string;
  extensively_used_min_fair?: string;
  extensively_used_min_expensive?: string;
  extensively_used_min_excellent?: string;
}
export type ImportingVariantDocument = Document & {
  category: string;
  brand: string;
  model: string;
  is_valid_brand?: boolean;
  series?: string;
  processor?: string;
  generation?: string;
  ram?: string;
  storage_memory?: string;
  year?: string;
  screen_size?: string;
  features?: string;
  model_type?: string;
  connectivity?: string;
  capacity?: string;
  market_price?: string;
  color?: string;
  gen_condition_id?: any;
  gen_variant_id?: any;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  like_new?: string;
  light_use?: string;
  good_condition?: string;
  extensive_use?: string;
  chipset?: string;
  sub_brand?: string;
  speed?: string;
  camera_model?: string;
  resolution?: string;
  sensor_type?: string;
  iso?: string;
  continuous_shooting_rate?: string;
  video_resolution?: string;
  'speakers?'?: string;
  monitor_type?: string;
  speaker_type?: string;
  router_type?: string;
  backlight?: string;
  first_letter?: string;
  second_letter?: string;
  third_letter?: string;
  car_model?: string;
  cylinders?: string;
  engine_displacement?: string;
  drive?: string;
  fuel_type?: string;
  transmission?: string;
  vehicle_size_class?: string;
  electric_motor?: string;
  car_mileage?: string;
  city?: string;
  neighborhood?: string;
  number_of_bedrooms?: string;
  number_of_bathrooms?: string;
  property_area?: string;

  timeTillSoldLikeNewExcellent?: string;
  timeTillSoldLikeNewFair?: string;
  timeTillSoldLikeNewExpensive?: string;

  timeTillSoldLightlyUsedExcellent?: string;
  timeTillSoldLightlyUsedFair?: string;
  timeTillSoldLightlyUsedExpensive?: string;

  timeTillSoldGoodConditionExcellent?: string;
  timeTillSoldGoodConditionFair?: string;
  timeTillSoldGoodConditionExpensive?: string;

  timeTillSoldExtensivelyUsedExcellent?: string;
  timeTillSoldExtensivelyUsedFair?: string;
  timeTillSoldExtensivelyUsedExpensive?: string;

  like_new_min_excellent?: string;
  like_new_min_fair?: string;
  like_new_min_expensive?: string;

  lightly_used_min_excellent?: string;
  lightly_used_min_fair?: string;
  lightly_used_min_expensive?: string;

  good_condition_min_excellent?: string;
  good_condition_min_fair?: string;
  good_condition_min_expensive?: string;

  extensively_used_min_excellent?: string;
  extensively_used_min_fair?: string;
  extensively_used_min_expensive?: string;
};

const importingVariantSchema = new Schema<ImportingVariantDocument>({
  category: { type: String },
  brand: { type: String },
  model: { type: String },
  is_valid_brand: { type: Boolean },
  chipset: { type: String },
  series: { type: String },
  processor: { type: String },
  generation: { type: String },
  ram: { type: String },
  storage_memory: { type: String },
  year: { type: String },
  screen_size: { type: String },
  features: { type: String },
  color: { type: String },
  model_type: { type: String },
  connectivity: { type: String },
  capacity: { type: String },
  market_price: { type: String },
  gen_variant_id: {
    type: Schema.Types.ObjectId,
    ref: 'varients',
    default: null,
  },
  gen_condition_id: {
    type: Schema.Types.ObjectId,
    ref: 'conditions',
    default: null,
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date },
  like_new: { type: String, default: '' },
  light_use: { type: String, default: '' },
  good_condition: { type: String, default: '' },
  extensive_use: { type: String, default: '' },
  sub_brand: { type: String },
  speed: { type: String },
  camera_model: { type: String },
  resolution: { type: String },
  sensor_type: { type: String },
  iso: { type: String },
  video_resolution: { type: String },
  continuous_shooting_rate: { type: String },
  'speakers?': { type: String },
  monitor_type: { type: String },
  backlight: { type: String },
  speaker_type: { type: String },
  router_type: { type: String },
  first_letter: { type: String },
  second_letter: { type: String },
  third_letter: { type: String },
  car_model: { type: String },
  cylinders: { type: String },
  engine_displacement: { type: String },
  drive: { type: String },
  fuel_type: { type: String },
  transmission: { type: String },
  vehicle_size_class: { type: String },
  electric_motor: { type: String },
  car_mileage: { type: String },
  city: { type: String },
  neighborhood: { type: String },
  number_of_bedrooms: { type: String },
  number_of_bathrooms: { type: String },
  property_area: { type: String },

  timeTillSoldLikeNewExcellent: { type: String },
  timeTillSoldLikeNewFair: { type: String },
  timeTillSoldLikeNewExpensive: { type: String },

  timeTillSoldLightlyUsedExcellent: { type: String },
  timeTillSoldLightlyUsedFair: { type: String },
  timeTillSoldLightlyUsedExpensive: { type: String },

  timeTillSoldGoodConditionExcellent: { type: String },
  timeTillSoldGoodConditionFair: { type: String },
  timeTillSoldGoodConditionExpensive: { type: String },

  timeTillSoldExtensivelyUsedExcellent: { type: String },
  timeTillSoldExtensivelyUsedFair: { type: String },
  timeTillSoldExtensivelyUsedExpensive: { type: String },

  like_new_min_excellent: { type: String },
  like_new_min_fair: { type: String },
  like_new_min_expensive: { type: String },

  lightly_used_min_excellent: { type: String },
  lightly_used_min_fair: { type: String },
  lightly_used_min_expensive: { type: String },

  good_condition_min_excellent: { type: String },
  good_condition_min_fair: { type: String },
  good_condition_min_expensive: { type: String },

  extensively_used_min_excellent: { type: String },
  extensively_used_min_fair: { type: String },
  extensively_used_min_expensive: { type: String },
});

export const ImportingVariant: Model<ImportingVariantDocument> = model(
  'ImportVariant',
  importingVariantSchema,
  'ImportVariant'
);
