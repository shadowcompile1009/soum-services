// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface LegacyUserAddressInput {
  id?: any;
  street: string;
  district: string;
  city: string;
  postal_code?: string;
  longitude?: string;
  latitude?: string;
  is_default?: boolean;
  is_verified?: boolean;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
  nationalAddress?: string;
}

export type AddressDocument = Document & {
  street: string;
  district: string;
  city: string;
  postal_code: string;
  longitude: string;
  latitude: string;
  is_default: boolean;
  is_verified: boolean;
  user_id: any;
  nationalAddress: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

const messageSchema = new Schema({
  // address: { type: String },
  // villa: { type: String },
  // neighborhood: { type: String, required: true },
  // province: { type: String },
  // state: { type: String },
  // country: { type: String, required: true },
  street: {
    type: String,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  nationalAddress: {
    type: String,
    default: '',
  },
  created_date: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updated_date: { type: Date },
  deleted_date: { type: Date },
});

export const Address: Model<AddressDocument> = model<AddressDocument>(
  'Address',
  messageSchema,
  'Address'
);
