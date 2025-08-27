import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';

export type OfferDocument = Offer & Document;
export class OfferSummary {
  @Prop({
    required: true,
  })
  commission: number;
  @Prop({
    required: true,
  })
  commissionVat: number;
  @Prop({
    required: true,
  })
  grandTotal: number;
}

@Schema()
export class Offer {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;
  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  productId: string;

  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  userId: string;

  @Prop({
    required: false,
  })
  userName: string;

  @Prop({
    required: true,
  })
  sellPrice: number;

  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: false,
  })
  message: string;

  @Prop({
    required: true,
  })
  buyerOfferSummary: OfferSummary;

  @Prop({
    required: true,
  })
  sellerOfferSummary: OfferSummary;
  @Prop({
    required: false,
  })
  messageAddedTime?: Date;

  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  updatedAt?: Date;
}

const schemaTransformation = {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
  },
};
export const OfferSchema = SchemaFactory.createForClass(Offer)
  .set('toJSON', schemaTransformation)
  .set('toObject', schemaTransformation);
