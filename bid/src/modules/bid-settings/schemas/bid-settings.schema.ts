import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BidSettingsSchemaDocument = BidSettings & Document;

@Schema({
  collection: 'bidSettings',
})
export class BidSettings {
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
    enum: ['Global', 'Automation'],
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

export const BidSettingsSchema = SchemaFactory.createForClass(BidSettings)
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
