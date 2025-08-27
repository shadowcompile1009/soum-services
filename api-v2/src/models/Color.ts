// @ts-nocheck
import { model, Schema } from 'mongoose';

const colorSchema = new Schema({
  color_name_en: { type: String },
  color_name_ar: { type: String },
  color_code: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const Color = model('Color', colorSchema, 'Color');
