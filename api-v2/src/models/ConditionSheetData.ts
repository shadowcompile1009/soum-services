// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export type ConditionRecord = Document & {
  conditionId: string;
  like_new: string;
  light_use: string;
  good_condition: string;
  extensive_use: string;
  varient_id: string;
  timeTillSoldLikeNewExpensive?: string;
  timeTillSoldLikeNewFair?: string;
  timeTillSoldLikeNewExcellent?: string;

  timeTillSoldLightlyUsedExpensive?: string;
  timeTillSoldLightlyUsedFair?: string;
  timeTillSoldLightlyUsedExcellent?: string;

  timeTillSoldGoodConditionExpensive?: string;
  timeTillSoldGoodConditionFair?: string;
  timeTillSoldGoodConditionExcellent?: string;

  timeTillSoldExtensivelyUsedExpensive?: string;
  timeTillSoldExtensivelyUsedFair?: string;
  timeTillSoldExtensivelyUsedExcellent?: string;

  like_new_min_expensive?: string;
  like_new_min_fair?: string;
  like_new_min_excellent?: string;

  lightly_used_min_expensive?: string;
  lightly_used_min_fair?: string;
  lightly_used_min_excellent?: string;

  good_condition_min_expensive?: string;
  good_condition_min_fair?: string;
  good_condition_min_excellent?: string;

  extensively_used_min_expensive?: string;
  extensively_used_min_fair?: string;
  extensively_used_min_excellent?: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

const conditionRecordSchema = new Schema<ConditionRecord>({
  conditionId: { type: String },
  like_new: { type: String },
  light_use: { type: String },
  good_condition: { type: String },
  extensive_use: { type: String },
  varient_id: { type: String },
  timeTillSoldLikeNewExpensive: { type: String },
  timeTillSoldLikeNewFair: { type: String },
  timeTillSoldLikeNewExcellent: { type: String },

  timeTillSoldLightlyUsedExpensive: { type: String },
  timeTillSoldLightlyUsedFair: { type: String },
  timeTillSoldLightlyUsedExcellent: { type: String },

  timeTillSoldGoodConditionExpensive: { type: String },
  timeTillSoldGoodConditionFair: { type: String },
  timeTillSoldGoodConditionExcellent: { type: String },

  timeTillSoldExtensivelyUsedExpensive: { type: String },
  timeTillSoldExtensivelyUsedFair: { type: String },
  timeTillSoldExtensivelyUsedExcellent: { type: String },

  like_new_min_expensive: { type: String },
  like_new_min_fair: { type: String },
  like_new_min_excellent: { type: String },

  lightly_used_min_expensive: { type: String },
  lightly_used_min_fair: { type: String },
  lightly_used_min_excellent: { type: String },

  good_condition_min_expensive: { type: String },
  good_condition_min_fair: { type: String },
  good_condition_min_excellent: { type: String },

  extensively_used_min_expensive: { type: String },
  extensively_used_min_fair: { type: String },
  extensively_used_min_excellent: { type: String },

  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date },
});

export const ConditionSheetRecord: Model<ConditionRecord> = model(
  'ConditionRecord',
  conditionRecordSchema,
  'ConditionRecord'
);
