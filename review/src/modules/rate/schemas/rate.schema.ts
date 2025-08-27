import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RateDocument = HydratedDocument<Rate>;

@Schema()
export class Rate {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Review',
    unique: true,
    required: true,
  })
  revieweeId: string;

  @Prop({ default: 1, min: 1, max: 5 })
  rate: number;

  @Prop({ default: 0 })
  count: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const RateSchema = SchemaFactory.createForClass(Rate);
