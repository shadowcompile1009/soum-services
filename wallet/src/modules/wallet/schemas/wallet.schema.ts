import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';
import { WalletStatus } from '../enums/wallet.status.enum';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;
  @Prop({
    validate: isValidObjectId,
    unique: true,
    required: true,
    dropDups: true,
  })
  ownerId: string;

  @Prop({
    required: true,
    unique: true,
    dropDups: true,
  })
  tag: string;

  @Prop({ required: true, default: 0, max: 6000 })
  balance: number;

  @Prop({ required: true, enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: string;

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
  onholdBalance: number;

  @Prop({
    virtual: true,
  })
  pendingTransactions: number;

  @Prop({
    virtual: true,
  })
  availableBalance: number;

  @Prop({
    virtual: true,
  })
  totalBalance: number;

  @Prop({
    virtual: true,
  })
  phoneNumber: string;

  @Prop({
    virtual: true,
  })
  userName: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)
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
  .pre<Wallet>('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const wallet = this;
    wallet.balance = Math.round(wallet.balance * 100) / 100;
    next();
  })
  .index({ '$**': 'text' });
