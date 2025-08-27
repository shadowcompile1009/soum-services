// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import { Question } from './Question';

export interface QuestionnaireInput {
  id?: any;
  brand?: any;
  category?: any;
  device_model?: any;
  description_en?: string;
  description_ar?: string;
  is_active?: boolean;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface QuestionnaireDocument extends Document {
  id?: any;
  brand?: any;
  category?: any;
  device_model?: any;
  description_en?: string;
  description_ar?: string;
  is_active?: boolean;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

const questionnaireSchema = new Schema(
  {
    brand: { type: Schema.Types.ObjectId, ref: 'brands' },
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
    device_model: { type: Schema.Types.ObjectId, ref: 'device_models' },
    description_en: { type: String },
    description_ar: { type: String },
    is_active: { type: Boolean },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    deleted_date: { type: Date },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals
  }
);

questionnaireSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'questionnaire_id',
  justOne: false,
  options: { sort: { order: 1 }, limit: 10 },
});

questionnaireSchema.pre('deleteOne', function (next) {
  Question.deleteMany({ questionnaire_id: this._id });
  next();
});

export const Questionnaire = model<QuestionnaireDocument>(
  'Questionnaire',
  questionnaireSchema,
  'Questionnaire'
);
