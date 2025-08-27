import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({ required: true })
  reviewerId: string;

  @Prop({ required: true })
  revieweeId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: false })
  productId: string;

  @Prop({ required: false, default: false })
  confirmed: boolean;

  @Prop({ required: false })
  anonymous: boolean;

  @Prop({ required: true, default: 1 })
  rate: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
  .set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  })
  .set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  })
  .index({ '$**': 'text' });
