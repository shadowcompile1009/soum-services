import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';
import { UserType } from 'src/modules/commission/enum/userSellerType.enum';
import { Commission } from 'src/modules/commission/schemas/commission.schema';

export type ProductCommissionDocument = Document & ProductCommission;
export class PromoCode {
  promoLimit: number;
  type: string;
  generator: string;
  discount: number;
  percentage: number;
}
export class CommissionAnalysis {
  penaltyCommission: number;
  penaltyCommissionVat: number;
  commissionTotalPercentage: number;
  commissionTotalFixed: number;
  paymentCommissionExtraFees: number;
  paymentCommission: number;
  paymentCommissionVat: number;
  nonPaymentCommission: number;
  nonPaymentCommissionVat: number;
  paymentCommissionWithVat: number;
  nonPaymentCommissionWithVat: number;
  realEstateVat: number;
}
export class SysSettings {
  vatPercentage: number;
  applyDeliveryFeeSPPs: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFee: boolean;
  deliveryFeeThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  buyerCommissionPercentage: number;
  sellerCommissionPercentage: number;
  priceQualityExtraCommission: number;
  applyReservation?: boolean;
  applyFinancing?: boolean;
}

export class Reservation {
  reservationAmount: number;
  reservationRemainingAmount: number;
}

export class FinancingRequest {
  amount: number;
}

export class AddOnCalculations {
  addOnsGrandTotal: number;
  addOnsTotal: number;
  addOnsVat: number;
}
@Schema()
export class ProductCommission {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({
    required: true,
  })
  sellPrice: number;
  @Prop({
    required: true,
  })
  commission: number;
  @Prop({
    required: true,
  })
  commissionVat: number;
  @Prop({
    required: true,
  })
  deliveryFee: number;
  @Prop({
    required: true,
  })
  deliveryFeeVat: number;
  @Prop({
    required: true,
  })
  totalVat: number;
  @Prop({
    required: true,
  })
  discount: number;
  @Prop({
    required: true,
  })
  grandTotal: number;
  @Prop({})
  reservation: Reservation;
  @Prop({})
  financingRequest: FinancingRequest;
  @Prop({})
  realEstateVat: number;
  @Prop({
    required: true,
  })
  commissionDiscount: number;
  @Prop({
    virtual: true,
  })
  commissionAnalysis: CommissionAnalysis;
  @Prop({
    virtual: true,
  })
  paymentId: string;
  @Prop({
    required: true,
  })
  addOnsTotal: number;
  @Prop({
    required: false,
  })
  addOnsGrandTotal: number;
  @Prop({
    required: false,
  })
  addOnsVat: number;
  @Prop({
    required: false,
  })
  isBuyer: boolean;
  @Prop({
    required: false,
  })
  userType: UserType;
  @Prop({
    required: true,
  })
  productId: string;
  @Prop({
    required: false,
  })
  orderId: string;

  @Prop({
    required: true,
  })
  commissions: Commission[];
  @Prop({
    required: false,
    default: null,
  })
  promoCode: PromoCode;

  @Prop({
    required: false,
  })
  sysSettings: SysSettings;
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

export const ProductCommissionSchema = SchemaFactory.createForClass(
  ProductCommission,
)
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
