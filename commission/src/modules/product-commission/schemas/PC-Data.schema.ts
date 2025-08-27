import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId } from 'mongoose';

export type PCDataDocument = Document & PCData;
@Schema()
export class PCData {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;

  @Prop({
    required: true,
  })
  orderId: string;
  @Prop({
    required: true,
  })
  ProductId: string;

  @Prop({
    required: true,
  })
  sellPrice: number;

  @Prop({
    required: true,
  })
  buyerCorrect: number;

  @Prop({
    required: true,
  })
  isDF: boolean;
  @Prop({
    required: true,
  })
  sellerCorrect: number;

  @Prop({
    required: true,
  })
  sellerStatus: string;

  @Prop({
    required: true,
  })
  export: string;

  @Prop({
    required: true,
  })
  buyerStatus: string;

  @Prop({
    required: true,
  })
  sellerListPrice: number;
  @Prop({
    required: true,
  })
  buyerListPrice: number;
  @Prop({
    required: true,
  })
  SellerCommissionBefore: number;
  @Prop({
    required: true,
  })
  SellerVATBefore: number;
  @Prop({
    required: true,
  })
  SellerCommissionAfter: number;
  @Prop({
    required: true,
  })
  SellerVATAfter: number;
  @Prop({
    required: true,
  })
  SellerDiscount: number;
  @Prop({
    required: true,
  })
  PayoutToSeller: number;
  @Prop({
    required: true,
  })
  BuyerCommissionBefore: number;
  @Prop({
    required: true,
  })
  BuyerVATBefore: number;
  @Prop({
    required: true,
  })
  BuyerCommissionAfter: number;
  @Prop({
    required: true,
  })
  BuyerVATAfter: number;
  @Prop({
    required: true,
  })
  BuyerDiscount: number;
  @Prop({
    required: true,
  })
  DeliveryFee: number;
  @Prop({
    required: true,
  })
  DeliveryVAT: number;
  @Prop({
    required: true,
  })
  PayoutToBuyerBefore: number;
  @Prop({
    required: true,
  })
  PayoutToBuyerAfter: number;
  @Prop({
    required: true,
  })
  BuyerAdditionalFees: number;

  @Prop({
    required: true,
  })
  NetCommission: number;
  @Prop({
    required: true,
  })
  AdditionalDiscount: number;
  @Prop({
    required: true,
  })
  GTRecalculated: number;

  @Prop({
    required: true,
  })
  GTRecalculatedSeller: number;
  @Prop({
    required: true,
  })
  GTCheck: number;

  @Prop({
    required: true,
  })
  GTCheckSeller: number;
}

export const PCDataSchema = SchemaFactory.createForClass(PCData);
