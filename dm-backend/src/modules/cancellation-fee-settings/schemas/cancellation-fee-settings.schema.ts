import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CancellationFeeSettingsType } from '../enums/cancellation-settings.enum';

export type CancellationFeeSettingsSchemaDocument = CancellationFeeSettings &
  Document;

@Schema({
  collection: 'cancellationFeeSettings',
  timestamps: true,
})
export class CancellationFeeSettings {
  @Prop({
    required: true,
    unique: true,
    index: true,
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
    enum: [
      CancellationFeeSettingsType.GLOBAL,
      CancellationFeeSettingsType.AUTOMATION,
    ],
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
  })
  config: number;
}

export const CancellationFeeSettingsSchema = SchemaFactory.createForClass(
  CancellationFeeSettings,
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
  })
  .index({ '$**': 'text' });
