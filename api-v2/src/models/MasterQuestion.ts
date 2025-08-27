// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export type MasterQuestion = Document & {
  category_id: any;
  question: string;
  question_ar: string;
  question_type: string;
  weightage: number;
  options: any[];
  status: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

const masterQuestionSchema = new Schema<MasterQuestion>({
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  question: { type: String },
  question_ar: { type: String },
  question_type: { type: String },
  weightage: { type: Number, default: 0 },
  options: [{ type: Schema.Types.Array }],
  status: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const MasterQuestion = model<MasterQuestion>(
  'MasterQuestion',
  masterQuestionSchema,
  'master_questions'
);
