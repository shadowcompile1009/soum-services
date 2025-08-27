import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';

export type DynamicCommissionDocument = Document & DynamicCommission;

@Schema()
export class DynamicCommission {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({ required: true, index: true })
  variant_id: string;

  @Prop({ required: true, index: true })
  condition_id: string;

  @Prop({ required: true })
  final_commission_rate: number;

  @Prop({ required: true })
  etag: string;

  @Prop({
    required: true,
    default: () => new Date(),
    index: true
  })
  lastUpdateDate: Date;

  @Prop({
    required: true,
    default: () => new Date(),
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: () => new Date(),
  })
  updatedAt: Date;
}

export const DynamicCommissionSchema = SchemaFactory.createForClass(DynamicCommission)
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
  });

// Add compound index for variant_id and condition_id
DynamicCommissionSchema.index({ variant_id: 1, condition_id: 1 }, { unique: true }); 
