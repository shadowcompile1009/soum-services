// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface ChoiceInput {
  _id?: any;
  question_id?: any;
  choice_id?: any;
  answer_id?: any;
  score?: number;
  option_en?: string;
  option_ar?: string;
  icon?: string;
  yes_answers?: [string];
  yes_question?: string;
  no_questions?: any;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface ChoiceDocument extends Document {
  answer_id?: any;
  score?: number;
  option_en?: string;
  option_ar?: string;
  position_en: number;
  position_ar: number;
  icon?: string;
  yes_answers: [string];
  yes_question: string;
  no_questions: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
}

const noQuestionSchema: Schema = new Schema({
  question: { type: String },
  answers: [{ type: String }],
});

const choiceSchema: Schema<ChoiceDocument> = new Schema<ChoiceDocument>({
  answer_id: { type: Schema.Types.ObjectId, ref: 'Answer' },
  option_en: { type: String },
  option_ar: { type: String },
  score: { type: Number },
  icon: { type: String },
  yes_answers: [{ type: String }],
  yes_question: { type: String },
  position_en: { type: Number, default: 10000 },
  position_ar: { type: Number, default: 10000 },
  no_questions: [noQuestionSchema],
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const Choice: Model<ChoiceDocument> = model<ChoiceDocument>(
  'Choice',
  choiceSchema,
  'Choice'
);
