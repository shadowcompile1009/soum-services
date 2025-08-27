// @ts-nocheck
import { Document, model, Schema, Types } from 'mongoose';
import { Content, QuestionKey } from './Question';

export interface ItemAnswerInput {
  answer_id: string;
  sub_choices?: Array<string>;
}

export interface ChoiceResponseInput {
  choiceId: string;
  choice: string;
}

export interface ItemResponseInput {
  question_id: string;
  answer_ids: Array<ItemAnswerInput>;
  choices?: Array<ChoiceResponseInput>;
  text_answer?: string;
}

export interface ChoiceResponseOutput {
  choice_id: string;
  score: number;
  option_en: string;
  option_ar: string;
  icon: string;
  position_en?: number;
  position_ar?: number;
}
export interface AnswerResponseOutput {
  answer_id: string;
  answer_en: string;
  answer_ar: string;
  icon: string;
  score: number;
  sub_choices?: Array<ChoiceResponseOutput>;
}
export interface ResponseOutput {
  text_placeholder_ar?: string;
  text_placeholder_en?: string;
  subtext_ar?: string;
  subtext_en?: string;
  response_id?: string;
  question_id?: string;
  question_type?: string;
  order?: number;
  question_en?: string;
  question_ar?: string;
  answers?: Array<AnswerResponseOutput>;
  choices?: Array<ChoiceResponseOutput>;
  question_key?: QuestionKey;
  bug_free_answer?: boolean;
  question_summary_content?: Content;
  text_answer?: string;
}

export interface ResponseInput {
  userId?: Types.ObjectId;
  product_id: string;
  responses: Array<ItemResponseInput>;
}

export interface IResponse extends Document {
  product: string;
  responses: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
}

export type ResponseType = Document & {
  product: any;
  responses: any;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

const responseSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  responses: { type: Schema.Types.Mixed },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const Response = model<ResponseType>(
  'Response',
  responseSchema,
  'Response'
);
