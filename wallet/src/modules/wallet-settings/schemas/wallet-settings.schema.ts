import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletSettingsSchemaDocument = WalletSettings & Document;

@Schema({
  collection: 'walletSettings',
})
export class WalletSettings {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  display: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    required: true,
    enum: ['Global', 'Automation', 'Seller Deposit'],
  })
  type: string;

  @Prop({
    required: true,
    default: false,
  })
  configurable: boolean;

  @Prop({
    required: true,
    default: false,
  })
  value: boolean;

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

export const WalletSettingsSchema = SchemaFactory.createForClass(WalletSettings)
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
