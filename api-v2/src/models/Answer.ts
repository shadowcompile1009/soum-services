// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import { Choice, ChoiceDocument, ChoiceInput } from './Choice';

export interface AnswerInput {
  answer_id?: string;
  question_id: any;
  score?: number;
  answer_en?: string;
  answer_ar?: string;
  yes_answers?: [string];
  yes_question?: string;
  no_questions?: [any];
  icon?: string;
  sub_choices: ChoiceInput[];
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}
export type AnswerDocument = Document & {
  question_id: { _id: any };
  answer_en: string;
  answer_ar: string;
  icon: string;
  score: number;
  yes_answers: [string];
  yes_question: string;
  no_questions: [any];
  sub_choices: [ChoiceDocument];
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

export interface INoQuestionSchema {
  question: string;
  answer: [string];
}

const noQuestionSchema: Schema = new Schema({
  question: { type: String },
  answers: [{ type: String }],
});

const answerSchema = new Schema<AnswerDocument>({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer_en: { type: String },
  answer_ar: { type: String },
  icon: { type: String },
  score: { type: Number },
  sub_choices: [{ type: Schema.Types.ObjectId, ref: 'Choice' }],
  yes_answers: [{ type: String }],
  yes_question: { type: String },
  no_questions: [noQuestionSchema],
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

answerSchema.pre('deleteOne', function (next) {
  Choice.deleteMany({ answer_id: this._id });
  next();
});
export const Answer = model<AnswerDocument>('Answer', answerSchema, 'Answer');
