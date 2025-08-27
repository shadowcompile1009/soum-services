// @ts-nocheck
import { model, Schema } from 'mongoose';

const capacitySchema = new Schema({
  capacity_name_en: { type: String },
  capacity_name_ar: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const Capacity = model('Capacity', capacitySchema, 'Capacity');
