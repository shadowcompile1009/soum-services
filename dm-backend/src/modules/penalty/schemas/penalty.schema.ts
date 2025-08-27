import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';
import { PenaltyStatus } from '../enums/penalty.status.enum';

export type PenaltyDocument = Penalty & Document;

@Schema()
export class Penalty {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
    enum: PenaltyStatus,
    default: PenaltyStatus.ACTIVE,
  })
  status: string;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({
    required: false,
  })
  isFulfilled: boolean;

  @Prop({
    required: false,
  })
  orderId: string;

  @Prop({
    required: false,
  })
  dmoId: string;

  @Prop({
    required: false,
  })
  nextDmoId: string;

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

  @Prop({
    virtual: true,
  })
  sellerName: string;
}

export const PenaltySchema = SchemaFactory.createForClass(Penalty)
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
  .pre<Penalty>('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const penalty = this;
    penalty.amount = Math.round(penalty.amount * 100) / 100;
    next();
  })
  .index({ '$**': 'text' });
