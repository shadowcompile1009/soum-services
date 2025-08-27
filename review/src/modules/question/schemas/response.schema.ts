import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResponseDocument = HydratedDocument<Response>;

class AnswerReference {
  @Prop()
  optionEn: string;

  @Prop()
  optionAr: string;

  @Prop()
  attachmentUrl: string;

  @Prop()
  text: string;
}

class ResponseReference {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  answers: AnswerReference[];
}

@Schema()
export class Response {
  @Prop({ require: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ type: [ResponseReference], require: true })
  responses?: ResponseReference[];

  @Prop({ required: false, default: 0 })
  score?: number;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
ResponseSchema.index({ userId: 1, productId: 1 }, { unique: true });

