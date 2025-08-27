import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';

export type StatusSchemaDocument = Status & Document;

@Schema()
export class Status {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  displayName: string;

  @Prop({
    required: true,
  })
  submodule: string;

  @Prop({ required: true, default: 0 })
  sequence: number;

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

export const StatusSchema = SchemaFactory.createForClass(Status)
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
  .index({ '$**': 'text' });
