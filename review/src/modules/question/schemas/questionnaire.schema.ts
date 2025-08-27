import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionnaireDocument = HydratedDocument<Questionnaire>;

export enum QuestionnaireStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}


class QuestionReference {
  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  version: number;

  @Prop()
  isRequired: boolean;
}

@Schema()
export class Questionnaire {
  @Prop({ required: true })
  categoryId: string;

  @Prop()
  categoryName: string;

  @Prop()
  descriptionEn: string;

  @Prop()
  descriptionAr: string;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  status: string;

  @Prop({ type: [QuestionReference] })
  questions: QuestionReference[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
