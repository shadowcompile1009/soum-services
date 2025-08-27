import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';
import { UserType } from '../enum/userSellerType.enum';
import { CommissionModule, CommissionType } from '../enum/commissionType.enum';
import { Status } from '../enum/status.enum';
import { PriceRangeOperator } from '../enum/PriceRangeOperator.enum';

export type CommissionDocument = Document & Commission;

export class PriceRange {
  @Prop({
    required: true,
  })
  operator: PriceRangeOperator;
  @Prop({
    required: true,
  })
  startValue: number;
  @Prop({
    required: true,
  })
  endValue: number;
}

export class PriceQualityCharge {
  @Prop({
    required: true,
  })
  fairPercentage: number;
  @Prop({
    required: true,
  })
  excellentPercentage: number;
  @Prop({
    required: true,
  })
  expensivePercentage: number;
}
@Schema()
export class Commission {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({
    default: null,
  })
  categoryId: string;

  @Prop({
    required: true,
    enum: CommissionType,
  })
  type: CommissionType;

  @Prop({
    required: false,
    enum: CommissionModule,
  })
  commissionModule?: CommissionModule;

  @Prop({
    required: true,
  })
  isBuyer: boolean;

  @Prop({
    required: true,
  })
  userType: UserType;

  @Prop({})
  minimum: number;

  @Prop({})
  maximum: number;

  @Prop({})
  percentage?: number;

  @Prop({
    required: true,
    enum: Status,
  })
  status: Status;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({})
  paymentOptionIds: string[];

  @Prop({})
  modelIds: string[];

  @Prop({
    required: false,
    type: PriceQualityCharge,
  })
  ranges: PriceQualityCharge;

  @Prop({
    required: false,
    type: PriceRange,
  })
  priceRange: PriceRange;

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

export const CommissionSchema = SchemaFactory.createForClass(Commission)
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
