import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId, Types } from 'mongoose';
import { Status } from './status.schema';

export type StatusGroupSchemaDocument = StatusGroup & Document;

@Schema()
export class StatusGroup {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({
    required: true,
  })
  operatingModel: string;

  @Prop({
    required: true,
  })
  statusName: string;

  @Prop({
    required: true,
  })
  groupStatusName: string;

  @Prop({
    required: true,
  })
  submodule: string;

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

export const StatusGroupSchema = SchemaFactory.createForClass(StatusGroup)
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
