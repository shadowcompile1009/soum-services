// @ts-nocheck
import { Document, Model, PaginateModel, Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { TransactionStatus } from '../enums/TransactionStatus';
import { AddOn } from './Brand';
import { BillingSettings } from './Product';

export enum TaskGeneratedStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}
export interface UpdatePayoutOrderInput {
  order_id: string;
  commission: number;
  commission_amount?: number;
  net_seller?: number;
  bank_name?: string;
  iban?: string;
  accountName?: string;
}

export interface OrderRefundStatus {
  refund: boolean;
  refund_status: TransactionStatus;
}
export interface AddOnsOrderSummary {
  addOns: AddOn[];
  addOnsTotal: number;
  addOnsGrandTotal: number;
  addOnsVat: number;
}
type BaseOrder = {
  product: any;
  seller: any;
  buyer: any;
  buyer_address: any;
  buy_amount: number;
  shipping_charge: number;
  vat: number; // buyer vat
  seller_vat: number;
  commission: number; //  buyer commission
  seller_commission: number;
  grand_total: number; // buyer grand total
  seller_grand_total: number;
  checkout_id: string;
  order_number: string;
  payment_type: string;
  transaction_id: string;
  return_reason: string;
  dispute_comment: string;
  dispute_validity: string;
  transaction_detail: string;
  shipment_detail: any;
  pickup_detail: any;
  split_payout_detail: any;
  track_detail: any;
  payout_notification_detail: any;
  transaction_status: string;
  paymentReceivedFromBuyer: string;
  paymentMadeToSeller: string;
  buy_type: string;
  dispute: string;
  status: string;
  delivery_time: Date;
  delivery_desc: string;
  commission_percentage: any;
  promos: any;
  isUserNotified: boolean;
  created_at: Date;
  updated_at: Date;
  sourcePlatform: string;
  bid_id: string;
  seller_payout_detail: any;
  order_refund_status: OrderRefundStatus;
  invoice_generated: TaskGeneratedStatus;
  billingSettings: BillingSettings;
  beforeCommissionService: boolean;
  commissionGenerated: TaskGeneratedStatus;
  addOns: AddOnsOrderSummary;
  isReservation?: boolean;
  isFinancing?: boolean;
  isConsignment?: boolean;
  synced_at: Date;
  gtmClientId?: string;
  gtmSessionId?: string;
  isFinancingEmailSent?: boolean;
};

export type OrderDocument = Document & BaseOrder;
export type TypesenseSyncedOrder = BaseOrder & {
  _id: any;
  dmOrder: string;
  dmStatus: string;
  addOns: AddOnsOrderSummary;
};

const orderSchema = new Schema<OrderDocument>({
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  seller: { type: Schema.Types.ObjectId, ref: 'LegacyUser' },
  buyer: { type: Schema.Types.ObjectId, ref: 'LegacyUser' },
  buyer_address: { type: Object },
  buy_amount: { type: Number },
  shipping_charge: { type: Number },
  vat: { type: Number },
  commission: { type: Number },
  grand_total: { type: Number },
  checkout_id: { type: String, default: '' },
  order_number: { type: String, default: '' },
  payment_type: { type: String, default: '' },
  transaction_id: { type: String, default: '' },
  return_reason: { type: String, default: '' },
  dispute_comment: { type: String, default: '' },
  dispute_validity: { type: String, default: '' },
  transaction_detail: { type: String, default: '' },
  shipment_detail: { type: Object, default: {} },
  pickup_detail: { type: Object, default: {} },
  split_payout_detail: { type: Object, default: {} },
  track_detail: { type: Object, default: {} },
  payout_notification_detail: { type: Object, default: {} },
  transaction_status: {
    type: String,
    enum: ['Pending', 'Success', 'Fail'],
    default: 'Pending',
  },
  paymentReceivedFromBuyer: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No',
  },
  paymentMadeToSeller: { type: String, enum: ['Yes', 'No'], default: 'No' },
  buy_type: { type: String, enum: ['Direct', 'Bid'], default: 'Direct' },
  dispute: { type: String, enum: ['Yes', 'No'], default: 'No' },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete', 'Delivered'],
    default: 'Active',
  },
  delivery_time: { type: Date },
  delivery_desc: { type: String, default: '' },
  commission_percentage: { type: Object },
  promos: { type: Object },
  isUserNotified: { type: Boolean, default: false },
  created_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updated_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  sourcePlatform: { type: String, default: '' },
  bid_id: { type: String, default: '' },
  seller_payout_detail: { type: Object, default: {} },
  order_refund_status: {
    type: Object,
    default: {
      refund: false,
    },
  },
  last_payout: { type: String, default: '' },
  invoice_generated: {
    type: TaskGeneratedStatus,
    default: TaskGeneratedStatus.PENDING,
  },
  billingSettings: {
    type: Object,
  },
  beforeCommissionService: {
    type: Boolean,
    default: false,
  },
  isFinancingEmailSent: {
    type: Boolean,
    default: false,
  },
  // Will be removed soon no need for it
  commissionGenerated: {
    type: TaskGeneratedStatus,
    default: TaskGeneratedStatus.SUCCESS,
  },
  addOns: { type: Object, default: null },
  isReservation: {
    type: Boolean,
    default: false,
  },
  isFinancing: {
    type: Boolean,
    default: false,
  },
  isConsignment: {
    type: Boolean,
    default: false,
  },
  synced_at: {
    type: Date,
    default: null,
  },
  gtmClientId: {
    type: String,
    default: '',
  },
  gtmSessionId: {
    type: String,
    default: '',
  },
});

orderSchema.plugin(paginate);

orderSchema.pre('updateOne', function () {
  this.set({ updated_at: new Date() });
});

orderSchema.pre('findOneAndUpdate', function () {
  this.findOneAndUpdate({}, { $set: { updated_at: new Date() } });
});

orderSchema.index({ synced_at: -1 });
orderSchema.index({ isReservation: 1 });
orderSchema.index({ isFinancing: 1 });

export const OrderModel: Model<OrderDocument> = model(
  'Order',
  orderSchema,
  'orders'
);

export const OrderPaginatedModel: PaginateModel<OrderDocument> = model(
  'Order',
  orderSchema,
  'orders'
) as any;
