// @ts-nocheck
import bcrypt from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

export interface UserAddress {
  id: any;
  address?: string;
  villa?: string;
  neighborhood: string;
  city: string;
  province?: string;
  postal_code?: string;
  state?: string;
  country: string;
  longitude?: string;
  latitude?: string;
  is_default?: boolean;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface BankDetailInput {
  iban: string;
  bankBIC: string;
  bankName: string;
  accountHolderName: string;
}

export interface WishList {
  followed_product_id: string;
  product_name: string;
  followed_date: Date;
}

// location schema
const wishlistSchema = new Schema({
  followed_product_id: { type: String },
  product_name: { type: String },
  followed_date: { type: Date, default: Date.now() },
});

export type UserDocument = Document & {
  username: string;
  email_address: string;
  md5_email: string;
  deleted_email: string;
  md5_deleted_email: string;
  avatar_url: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_phone_verified: boolean;
  reset_password_token: string;
  addresses: [{ _id: any }];
  wishlist: [WishList];
  cards: [string];
  role: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
  reset_date: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    otpTime: { type: Number },
    otpVerification: { type: Boolean },
    profilePic: { type: String },
    secretKey: { type: String },
    token: [String],
    username: { type: String, unique: true },
    password: { type: String },
    email_address: { type: String, unique: true },
    md5_email: { type: String },
    deleted_email: { type: String },
    md5_deleted_email: { type: String },
    avatar_url: { type: String },
    is_phone_verified: { type: Boolean },
    first_name: { type: String },
    last_name: { type: String },
    reset_password_token: { type: String },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    wishlist: [wishlistSchema],
    cards: [String],
    role: { type: String },
    phone_number: { type: String, unique: true },
    created_date: { type: Date, default: Date.now() },
    updated_date: { type: Date, default: Date.now() },
    deleted_date: { type: Date, default: null },
    reset_date: { type: Date },
  },
  {
    collection: 'User',
  }
);

const hash = (user: UserDocument, salt: string, next: any) => {
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
userSchema.pre('save', function (next) {
  const user = this as UserDocument;
  // check to see if the password is changing
  if (!user.isModified('password')) {
    // move on
    next();
  }

  return genSalt(user, 10, next);
});

export const User = model<UserDocument>('User', userSchema, 'User');
