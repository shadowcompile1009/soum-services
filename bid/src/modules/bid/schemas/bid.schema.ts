import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema()
export class Bid {
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
    validate: isValidObjectId,
    required: true,
  })
  statusId: string;

  @Prop({
    // validate: isValidObjectId,
    required: false,
  })
  transactionId: string;
  @Prop({
    virtual: true,
  })
  transaction: string;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({
    required: true,
  })
  productName: string;

  @Prop({
    required: true,
  })
  productNameAr: string;

  @Prop({
    virtual: true,
  })
  status: string;

  @Prop({
    virtual: true,
  })
  startBid: number;
  @Prop({
    virtual: true,
  })
  grandTotal: number;

  @Prop({
    virtual: true,
  })
  sellerId: string;

  @Prop({
    virtual: true,
  })
  sellerName: string;

  @Prop({
    virtual: true,
  })
  buyerName: string;

  @Prop({
    virtual: true,
  })
  checkoutId: string;
  @Prop({
    virtual: true,
  })
  checkoutURL: string;

  @Prop({
    required: false,
  })
  isAuthorizedTransaction: boolean;

  @Prop({
    required: false,
  })
  orderId: string;

  @Prop({
    required: false,
  })
  dmOrderId: string;

  @Prop({
    required: false,
    default: 0,
  })
  reverceOperationCount: number;

  @Prop({
    required: true,
    // Set 1 day expiration time by default
    default: () => {
      return new Date(Date.now() + 86400 * 1000);
    },
  })
  expiresAt: Date;

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

export const BidSchema = SchemaFactory.createForClass(Bid)
  .set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toHexString();
      delete ret._id;
    },
  })
  .set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toHexString();
      delete ret._id;
    },
  })
  .pre<Bid>('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const bid = this;
    bid.amount = Math.round(bid.amount * 100) / 100;
    next();
  })
  .index({ '$**': 'text' });
