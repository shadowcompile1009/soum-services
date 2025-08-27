// @ts-nocheck
import { model, Schema } from 'mongoose';

const bidSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    default: Schema.Types.ObjectId,
    ref: 'product',
  },
  bidId: { type: Schema.Types.ObjectId },
  bidder: {
    type: Schema.Types.ObjectId,
    default: Schema.Types.ObjectId,
    ref: 'user',
  },
  pay_bid_amount: { type: Number },
  payment_type: { type: String },
  grand_total: { type: Number },
  vat: { type: Number },
  commission: { type: Number },
  shipping_charge: { type: Number },
  buy_amount: { type: Number },
  bid_status: { type: String },
  transaction_status: { type: String },
  payment_take: { type: String },
  bid_date: { type: Date },
  order_number: { type: String },
  buyer_mobile_number: { type: String },
  seller_mobile_number: { type: String },
  deletedBy: { type: String, default: '' },
  deletedByUserType: { type: String, default: '' },
  lastStatusUpdatedDate: { type: Date },
});

export const Bid = model('bids', bidSchema, 'bids');
