// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface ConditionType {
  like_new: string;
  light_use: string;
  good_condition: string;
  extensive_use: string;
  like_new_ar: string;
  light_use_ar: string;
  good_condition_ar: string;
  extensive_use_ar: string;
  varient_id: string;
  createdAt: Date;
  migration_source?: string;
  timeTillSold?: any;
  priceRange?: any;
  updatedSource?: string;
}

export interface PriceRange {
  [key: string]: string;
  like_new_min_expensive?: string;
  like_new_min_expensive_price_nudge?: string;
  like_new_min_fair?: string;
  like_new_min_fair_price_nudge?: string;
  like_new_min_excellent?: string;
  like_new_min_excellent_price_nudge?: string;
  lightly_used_min_expensive?: string;
  lightly_used_min_expensive_price_nudge?: string;
  lightly_used_min_fair?: string;
  lightly_used_min_fair_price_nudge?: string;
  lightly_used_min_excellent?: string;
  lightly_used_min_excellent_price_nudge?: string;
  good_condition_min_expensive?: string;
  good_condition_min_expensive_price_nudge?: string;
  good_condition_min_fair?: string;
  good_condition_min_fair_price_nudge?: string;
  good_condition_min_excellent?: string;
  good_condition_min_excellent_price_nudge?: string;
  extensively_used_min_expensive?: string;
  extensively_used_min_expensive_price_nudge?: string;
  extensively_used_min_fair?: string;
  extensively_used_min_fair_price_nudge?: string;
  extensively_used_min_excellent?: string;
  extensively_used_min_excellent_price_nudge?: string;
}

export interface PriceRangeInput {
  [key: string]: number;
  like_new_max_expensive?: number;
  like_new_max_fair?: number;
  like_new_min_fair?: number;
  lightly_used_max_expensive?: number;
  lightly_used_max_fair?: number;
  lightly_used_min_fair?: number;
  good_condition_max_expensive?: number;
  good_condition_max_fair?: number;
  good_condition_min_fair?: number;
  extensively_used_max_expensive?: number;
  extensively_used_max_fair?: number;
  extensively_used_min_fair?: number;
}

export interface TimeTillSold {
  [key: string]: number;
  timeTillSoldLikeNewExpensive?: number;
  timeTillSoldLikeNewExpensiveNudge?: number;
  timeTillSoldLikeNewFair?: number;
  timeTillSoldLikeNewFairNudge?: number;
  timeTillSoldLikeNewExcellent?: number;
  timeTillSoldLikeNewExcellentNudge?: number;
  timeTillSoldLightlyUsedExpensive?: number;
  timeTillSoldLightlyUsedExpensiveNudge?: number;
  timeTillSoldLightlyUsedFair?: number;
  timeTillSoldLightlyUsedFairNudge?: number;
  timeTillSoldLightlyUsedExcellent?: number;
  timeTillSoldLightlyUsedExcellentNudge?: number;
  timeTillSoldGoodConditionExpensive?: number;
  timeTillSoldGoodConditionExpensiveNudge?: number;
  timeTillSoldGoodConditionFair?: number;
  timeTillSoldGoodConditionFairNudge?: number;
  timeTillSoldGoodConditionExcellent?: number;
  timeTillSoldGoodConditionExcellentNudge?: number;
  timeTillSoldExtensivelyUsedExpensive?: number;
  timeTillSoldExtensivelyUsedExpensiveNudge?: number;
  timeTillSoldExtensivelyUsedFair?: number;
  timeTillSoldExtensivelyUsedFairNudge?: number;
  timeTillSoldExtensivelyUsedExcellent?: number;
  timeTillSoldExtensivelyUsedExcellentNudge?: number;
}

export interface UpdateConditionRequestBody {
  like_new: string;
  like_new_ar: string;
  light_use: string;
  light_use_ar: string;
  good_condition: string;
  good_condition_ar: string;
  extensive_use: string;
  extensive_use_ar: string;
  priceRange: PriceRangeInput;
  timeTillSold: TimeTillSold;
}

export interface Condition {
  like_new: string;
  light_use: string;
  good_condition: string;
  extensive_use: string;
  like_new_ar: string;
  light_use_ar: string;
  good_condition_ar: string;
  extensive_use_ar: string;
}

export type ConditionDocument = Document & {
  like_new: string;
  like_new_price_nudge: string;
  light_use: string;
  light_use_price_nudge: string;
  good_condition: string;
  good_condition_price_nudge: string;
  extensive_use: string;
  extensive_use_price_nudge: string;
  like_new_ar: string;
  like_new_price_nudge_ar: string;
  light_use_ar: string;
  light_use_price_nudge_ar: string;
  good_condition_ar: string;
  good_condition_price_nudge_ar: string;
  extensive_use_ar: string;
  extensive_use_price_nudge_ar: string;
  varient_id: string;
  createdAt: Date;
  migration_source?: string;
  timeTillSold?: any;
  priceRange?: any;
  updatedSource?: string;
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const ConditionSchema = new Schema<ConditionDocument>({
  like_new: { type: String, default: '' },
  like_new_price_nudge: { type: String, default: '' },
  light_use: { type: String, default: '' },
  light_use_price_nudge: { type: String, default: '' },
  good_condition: { type: String, default: '' },
  good_condition_price_nudge: { type: String, default: '' },
  extensive_use: { type: String, default: '' },
  extensive_use_price_nudge: { type: String, default: '' },
  like_new_ar: { type: String, default: '' },
  like_new_price_nudge_ar: { type: String, default: '' },
  light_use_ar: { type: String, default: '' },
  light_use_price_nudge_ar: { type: String, default: '' },
  good_condition_ar: { type: String, default: '' },
  good_condition_price_nudge_ar: { type: String, default: '' },
  extensive_use_ar: { type: String, default: '' },
  extensive_use_price_nudge_ar: { type: String, default: '' },
  varient_id: { type: Schema.Types.ObjectId, ref: 'varients' },
  createdAt: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  migration_source: { type: String },
  timeTillSold: { type: Object },
  priceRange: { type: Object },
  updatedSource: { type: String },
});

export const Condition: Model<ConditionDocument> = model(
  'conditions',
  ConditionSchema,
  'conditions'
);
