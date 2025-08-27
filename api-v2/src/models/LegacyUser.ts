// @ts-nocheck
import bcrypt from 'bcrypt';
import { Document, model, Schema } from 'mongoose';
import { Address } from './Address';

export type PreferencesType = {
  skip_pre_listing?: boolean;
  skip_post_listing?: boolean;
  is_wallet_first_visit?: boolean;
  is_new_badge_alert?: boolean;
  is_cancellation_alert?: boolean;
  is_penalized_alert?: boolean;
  is_express_delivery_onboarded?: boolean;
  is_filter_onboarded?: boolean;
};

export type RatesType = {
  cancellation_rate?: number;
  completion_rate?: number;
  reliability_badge?: boolean;
};

export type ListingsType = {
  sold_listings?: number;
  active_listings?: number;
  completed_sales?: number;
  purchased_products?: number;
};

export type Tag = {
  name?: string;
};
export interface UpdateUserInput {
  name?: string;
  isMerchant?: boolean;
  isBetaUser?: boolean;
  isKeySeller?: boolean;
  isUAE?: boolean;
  isCompliant?: boolean;
  rating?: number;
  hasOptedForSF?: boolean;
  isSFPaid?: boolean;
}

export type SellerType = {
  isMerchant?: boolean;
  isBetaUser?: boolean;
  isKeySeller?: boolean;
  isUAE?: boolean;
  isCompliant?: boolean;
};

export type UserLegacyDocument = Document & {
  name: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  otp: string;
  otpTime: Date;
  otpVerification: boolean;
  profilePic: string;
  countryCode: string;
  secretKey: string;
  language: string;
  address: any;
  cards: [string];
  bankDetail: any;
  token: [string];
  loginWith: string;
  status: string;
  userType: string;
  preferences: PreferencesType;
  penalty?: number;
  created_date?: Date;
  createdDate: Date;
  updated_date?: Date;
  deleted_date?: Date;
  reset_date?: Date;
  addresses?: any[];
  tags?: Tag[];
  is_address_migration: boolean;
  isBetaUser: boolean;
  isKeySeller: boolean;
  isBlock?: boolean;
  blockTimestamp?: Date;
  rates?: RatesType;
  rates_scan?: boolean;
  listings: ListingsType;
  isMerchant?: boolean;
  rating?: number;
  sellerType?: SellerType;
  hasOptedForSF?: boolean;
  isSFPaid?: boolean;
  bio?: string;
  sellerReceivedNudgeNotification?: boolean;
};

const userLegacySchema = new Schema<UserLegacyDocument>(
  {
    name: { type: String, index: true },
    lastName: { type: String },
    email: { type: String, unique: true },
    mobileNumber: { type: String, unique: true, index: true },
    password: { type: String },
    otp: { type: String },
    otpTime: { type: Number, default: Date.now() },
    otpVerification: { type: Boolean, default: false },
    profilePic: { type: String },
    countryCode: { type: String },
    secretKey: { type: String, default: '' },
    language: { type: String, default: 'en' },
    address: { type: Object, default: {} },
    cards: { type: Array, default: [] },
    bankDetail: { type: Object, default: {} },
    token: { type: Array, default: [] },
    loginWith: { type: String },
    status: {
      type: String,
      enum: ['Inactive', 'Active', 'Delete'],
      default: 'Active',
    },
    userType: { type: String },
    preferences: {
      skip_pre_listing: { type: Boolean, default: false },
      skip_post_listing: { type: Boolean, default: false },
      is_wallet_first_visit: { type: Boolean, default: true },
      is_new_badge_alert: { type: Boolean, default: false },
      is_cancellation_alert: { type: Boolean, default: false },
      is_penalized_alert: { type: Boolean, default: false },
      is_express_delivery_onboarded: { type: Boolean, default: false },
      is_filter_onboarded: { type: Boolean, default: false },
    },
    created_date: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    deleted_date: { type: Date, default: null },
    reset_date: { type: Date },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    is_address_migration: { type: Boolean, default: false },
    isBetaUser: { type: Boolean, default: false },
    isKeySeller: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    blockTimestamp: { type: Date },
    tags: { type: Array, default: [] },
    rates: {
      cancellation_rate: { type: Number, default: 0 },
      completion_rate: { type: Number, default: 0 },
      reliability_badge: { type: Boolean, default: false },
    },
    rates_scan: { type: Boolean, default: true },
    listings: {
      sold_listings: { type: Number, default: 0 },
      active_listings: { type: Number, default: 0 },
      completed_sales: { type: Number, default: 0 },
      purchased_products: { type: Number, default: 0 },
    },
    isMerchant: { type: Boolean, default: false },
    hasOptedForSF: { type: Boolean, default: false },
    isSFPaid: { type: Boolean, default: false },
    rating: { type: Number, default: null },
    sellerType: {
      // isMerchant, isBetaUser and isKeySeller will be treated as techdebt
      // need to identify the affected areas before migrating
      isMerchant: { type: Boolean, default: false },
      isBetaUser: { type: Boolean, default: false },
      isKeySeller: { type: Boolean, default: false },
      isUAE: { type: Boolean, default: false },
      isCompliant: { type: Boolean, default: true },
    },
    bio: { type: String },
    sellerReceivedNudgeNotification: { type: Boolean, default: false },
  },
  {
    collection: 'users',
  }
);

const hash = (user: UserLegacyDocument, salt: string, next: any) => {
  bcrypt.hash(user.password, salt, (err, newHash) => {
    if (err) {
      next(err);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (user: any, saltRounds: number, next: any) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      next(err);
    }
    return hash(user, salt, next);
  });
};

/**
 * Password hash middleware.
 */
userLegacySchema.pre('save', function (next) {
  const user = this as UserLegacyDocument;
  // check to see if the password is changing
  if (!user.isModified('password')) {
    // move on
    next();
  }

  return genSalt(user, 10, next);
});

userLegacySchema.virtual('device_tokens', {
  ref: 'DeviceToken',
  localField: '_id',
  foreignField: 'user_id',
  justOne: false,
  options: { sort: { order: 1 }, limit: 20 },
});

userLegacySchema.virtual('penalty');

userLegacySchema.pre('deleteOne', function (next) {
  Address.deleteMany({ user_id: this._id });
  next();
});
export const LegacyUser = model<UserLegacyDocument>(
  'LegacyUser',
  userLegacySchema,
  'users'
);
