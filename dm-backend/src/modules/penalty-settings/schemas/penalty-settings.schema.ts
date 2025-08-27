import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PenaltySettingsType } from '../enums/penalty-settings.enum';

export type PenaltySettingsSchemaDocument = PenaltySettings & Document;

@Schema({
  collection: 'penaltySettings',
})
export class PenaltySettings {
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
    enum: [PenaltySettingsType.GLOBAL, PenaltySettingsType.AUTOMATION],
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
  config: number[];

  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop({
    required: false,
    default: () => {
      return new Date();
    },
  })
  updatedAt?: Date;
}

export const PenaltySettingsSchema = SchemaFactory.createForClass(
  PenaltySettings,
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
