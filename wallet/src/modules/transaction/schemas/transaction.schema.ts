import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';
import { CreditType } from '../enums/transaction.creditType.enum';
import { TransactionStatus } from '../enums/transaction.status.enum';
import { TransactionType } from '../enums/transaction.type.enum';
export type TransactionDocument = Transaction & Document;
export type TransactionHistoryDocument = TransactionHistory & Document;

@Schema()
export class TransactionHistory {
  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  transactionId: string;

  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  agentId: string;

  @Prop({ required: true })
  agentName: string;

  @Prop({
    required: true,
  })
  status: string;

  @Prop({})
  hyperpayCreatedAt: Date;

  @Prop({})
  hyperpayBatchId: string;

  @Prop({})
  hyperpayUniqueId: string;

  @Prop({})
  amount: number;

  @Prop({})
  userPhoneNumber: string;

  @Prop({
    default: () => {
      return new Date();
    },
  })
  createdAt?: Date;

  @Prop({
    default: () => {
      return new Date();
    },
  })
  updatedAt?: Date;
}

@Schema()
export class Metadata {
  @Prop({ enum: CreditType })
  creditType: string;
}

@Schema()
export class Transaction {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;
  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  ownerId: string;

  @Prop({
    validate: isValidObjectId,
    required: true,
    ref: 'wallets',
  })
  walletId: string;

  @Prop({
    validate: isValidObjectId,
  })
  orderId: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: true,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: string;

  @Prop({
    required: true,
    enum: TransactionType,
    default: TransactionType.WITHDRAWAL,
  })
  type: string;

  @Prop({ type: Array<TransactionHistory> })
  history: TransactionHistoryDocument[];

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: Metadata,
  })
  metadata: Metadata;

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

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
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
  .pre<Transaction>('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const transaction = this;
    transaction.amount = Math.round(transaction.amount * 100) / 100;
    next();
  })
  .pre<Transaction>('update', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const transaction = this;
    transaction.amount = Math.round(transaction.amount * 100) / 100;
    next();
  })
  .index({ '$**': 'text' });
