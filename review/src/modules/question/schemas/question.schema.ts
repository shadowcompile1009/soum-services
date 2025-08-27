import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

export enum QuestionType {
  YesNo = 'yes-no',
  Dropdown = 'dropdown',
  MultipleChoice = 'multiple-choice',
  InputText = 'input-text',
  SingleChoiceWithPhotos = 'single-choice-with-photos',
  MultipleChoiceWithPhotos = 'multiple-choice-with-photos',
}

export enum QuestionStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}

export enum QuestionLevel {
  Excellent = 'excellent',
  VeryGood = 'very-good',
  Good = 'good',
  Acceptable = 'acceptable',
  Poor = 'poor',
}

class OptionReference {
  @Prop()
  nameEn: string;

  @Prop()
  nameAr: string;

  @Prop()
  score: number;

  @Prop()
  imageUrl: string;

  @Prop({ enum: QuestionLevel })
  level: string;

  @Prop()
  attachmentRequired: string;
}

@Schema()
export class Question {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  questionId: string;

  @Prop({ required: true })
  questionEn: string;

  @Prop({ required: true })
  questionAr: string;

  @Prop({ require: true, enum: QuestionType })
  questionType: string;

  @Prop()
  placeholderTextEn: string;

  @Prop()
  placeholderTextAr: string;

  @Prop()
  subTextEn: string;

  @Prop()
  subTextAr: string;

  @Prop()
  isMandatory: boolean;

  @Prop({ required: true })
  version: number;

  @Prop({ type: [OptionReference], required: true })
  options: OptionReference[];

  @Prop({ required: true, enum: ['active', 'inactive'] })
  status: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.index({ questionId: 1, version: 1 }, { unique: true });
