import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';

export type WalletSettingsConfigDocument = WalletSettingsConfig & Document;

@Schema({
  collection: 'walletSettingsConfig',
})
export class WalletSettingsConfig {
  @Prop({
    validate: isValidObjectId,
    required: true,
  })
  walletSettingsId: string;

  @Prop({
    required: true,
  })
  config: string;

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

export const WalletSettingsConfigSchema = SchemaFactory.createForClass(
  WalletSettingsConfig,
)
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
  });
