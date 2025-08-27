// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import { Answer, AnswerInput } from './Answer';
import { Choice, ChoiceInput } from './Choice';
export enum QuestionKey {
  // headphones, tablet, mobiles, laptops, watches, cameras, monitor
  SCREEN_BODY = 'ScreenAndBody',
  // tablet, mobiles, laptops, watches, gaming
  MAINTENANCE = 'Maintenance',
  // tablet, mobiles, laptops, watches
  BATTERY = 'Battery',
  // headphones
  PAIRING = 'Pairing',
  // headphones
  AGE = 'Age',
  // headphones, tablet, mobiles, laptops, watches, gaming, cameras, monitor
  FUNCTIONAL_PROBLEMS = 'FunctionalProblem',
  // headphones, tablet, mobiles, laptops, watches, gaming, cameras, monitor
  ACCESSORIES = 'Accessories',
  // cameras, monitor
  WORKING_DEVICE = 'WorkingDevice',
  // cameras
  SHUTTER_COUNT = 'ShutterCount',
  WARRANTY = 'Warranty',
}

export interface QuestionSummaryContent {
  defect_content: Content;
  valid_content: Content;
}

export interface Content {
  ar_content: string;
  en_content: string;
}

export interface QuestionInput {
  questionnaire_id: any;
  type: string;
  order: number;
  question_en?: string;
  question_ar?: string;
  question_key?: QuestionKey;
  is_mandatory?: boolean;
  text_placeholder_en?: string;
  text_placeholder_ar?: string;
  subtext_en?: string;
  subtext_ar?: string;
  answers?: [AnswerInput];
  choices?: [ChoiceInput];
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface QuestionUpdateInput {
  question_id: any;
  type: string;
  order: number;
  is_mandatory?: boolean;
  text_placeholder_en?: string;
  text_placeholder_ar?: string;
  subtext_en?: string;
  subtext_ar?: string;
  question_en?: string;
  question_ar?: string;
  answers?: [AnswerInput];
  choices?: [ChoiceInput];
  question_key?: QuestionKey;
  summary_content?: QuestionSummaryContent;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export type QuestionDocument = Document & {
  questionnaire_id: any;
  type: string;
  order: number;
  question_en: string;
  question_ar: string;
  answers: string[];
  choices: string[];
  question_key: QuestionKey;
  summary_content: QuestionSummaryContent;
  is_mandatory: boolean;
  text_placeholder_en?: string;
  text_placeholder_ar?: string;
  subtext_en?: string;
  subtext_ar?: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

const questionSchema = new Schema<QuestionDocument>({
  questionnaire_id: { type: Schema.Types.ObjectId, ref: 'Questionnaire' },
  type: { type: String },
  order: { type: Number },
  question_en: { type: String },
  question_ar: { type: String },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  choices: [{ type: Schema.Types.ObjectId, ref: 'Choice' }],
  question_key: { type: QuestionKey },
  is_mandatory: { type: Boolean },
  text_placeholder_en: { type: String },
  text_placeholder_ar: { type: String },
  subtext_en: { type: String },
  subtext_ar: { type: String },
  summary_content: { type: Object },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date },
  deleted_date: { type: Date },
});

questionSchema.pre('deleteOne', function (next) {
  Answer.deleteMany({ question_id: this._id });
  Choice.deleteMany({ _id: { $in: this.choices } });
  next();
});

export const Question = model<QuestionDocument>(
  'Question',
  questionSchema,
  'Question'
);
