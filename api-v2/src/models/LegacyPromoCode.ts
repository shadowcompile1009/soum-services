// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
import { PaymentProvider, PaymentProviderType } from './Payment';

export type LegacyPromoCodeDocument = Document & {
  userType: string;
  promoType: string;
  promoGenerator: string;
  status: string;
  code: string;
  userId: any;
  discount: number;
  percentage: number;
  totalGainedCredit: number;
  totalReimburseCredit: number;
  netRemainingCredit: number;
  fromDate: Date;
  toDate: Date;
  createdDate: Date;
  updatedDate: Date;
  promoSellerUsageCount: number;
  promoBuyerUsageCount: number;
  totalUsage: number;
  promoLimit: number;
  availablePayment: PromoCodePayment[];
  isDefault: boolean;
  promoCodeScope: PromoCodeScope[];
};

export enum PromoType {
  FIXED = 'Fixed',
  PERCENTAGE = 'Percentage',
}
export enum PromoGenerator {
  ADMIN = 'Admin',
  REFERRAL = 'Referral',
}

export enum UserType {
  SELLER = 'Seller',
  BUYER = 'Buyer',
}

export class PromoCodePayment {
  paymentProvider: PaymentProvider;
  paymentProviderType: PaymentProviderType;
}

export class PromoCodeScope {
  promoCodeScopeType: PromoCodeScopeTypeEnum;
  ids: string[];
}

export enum PromoCodeScopeTypeEnum {
  FEEDS = 'feeds',
}

const legacyPromoCodeSchema: Schema = new Schema({
  userType: { type: String, enum: UserType, default: UserType.SELLER },
  promoType: {
    type: String,
    enum: PromoType,
    default: PromoType.PERCENTAGE,
  },
  promoGenerator: {
    type: String,
    enum: PromoGenerator,
    default: PromoGenerator.ADMIN,
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  code: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'LegacyUser' },
  discount: { type: Number },
  percentage: { type: Number },
  totalGainedCredit: { type: Number, default: 0 },
  totalReimburseCredit: { type: Number, default: 0 },
  netRemainingCredit: { type: Number, default: 0 },
  fromDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  toDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  createdDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updatedDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  promoSellerUsageCount: { type: Number, default: 0 },
  promoBuyerUsageCount: { type: Number, default: 0 },
  totalUsage: { type: Number, default: 0 },
  promoLimit: { type: Number, default: 0 },
  availablePayment: { type: Array, default: [], Element: PromoCodePayment },
  isDefault: { type: Boolean, default: false },
  promoCodeScope: { type: Array, default: [], Element: PromoCodeScope },
});

export const LegacyPromoCode: Model<LegacyPromoCodeDocument> =
  model<LegacyPromoCodeDocument>(
    'LegacyPromoCode',
    legacyPromoCodeSchema,
    'promocodes'
  );
