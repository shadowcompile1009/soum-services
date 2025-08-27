import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, isValidObjectId } from 'mongoose';
import {
  UserType,
  PromoType,
  PromoGenerator,
  PromoCodeStatus,
  PromoCodeScope,
  PromoCodePayment,
} from '@modules/promo-code/enum';

@Schema()
export class PromoCode {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;
  @Prop({
    required: false,
  })
  userType: UserType;
  @Prop({
    required: true,
    default: PromoType.PERCENTAGE,
  })
  promoType: PromoType;
  @Prop({
    required: true,
    default: PromoGenerator.ADMIN,
  })
  promoGenerator: PromoGenerator;
  @Prop({
    required: true,
    default: PromoCodeStatus.ACTIVE,
  })
  status: PromoCodeStatus;

  @Prop({ unique: true, isRequired: false, sparse: true })
  code: string;
  @Prop({ isRequired: false })
  bulkPrefix: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromoCodeGenerationTask',
    required: false,
  })
  taskId: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromoCode',
    required: false,
  })
  parentPromoCodeId: string;

  @Prop({})
  userId: string;

  @Prop({
    required: false,
  })
  promoLimit: number;
  @Prop({})
  discount: number;
  @Prop({})
  percentage: number;
  @Prop({
    required: false,
  })
  fromDate: Date;
  @Prop({
    required: false,
  })
  toDate: Date;
  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  createdDate: Date;
  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  updatedDate: Date;
  @Prop({
    default: false,
  })
  isDefault: boolean;
  @Prop({
    required: false,
  })
  totalAllowedUsage: number;
  @Prop({
    default: 0,
  })
  totalUsage: number;

  @Prop({ required: false })
  note: string;

  @Prop({})
  promoCodeScope: PromoCodeScope[];
  @Prop({})
  excludedPromoCodeScope: PromoCodeScope[];

  @Prop({})
  availablePayment: PromoCodePayment[];
}

export type PromoCodeDocument = Document & PromoCode;

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode)
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
