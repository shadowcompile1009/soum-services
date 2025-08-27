// @ts-nocheck
import moment from 'moment';
import mongoose, {
  Document,
  Model,
  model,
  Schema,
  PaginateModel,
} from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import mongooseHidden from 'mongoose-hidden';
import { OrderSyncDto } from '../dto/order/dmOrderSyncDto';
import { DeltaMachineBNPLStatuses } from '../enums/DeltaMachineStatusSubmodule';
import { OrderType } from '../enums/OrderType.Enum';
import { DeltaMachinePayoutType } from '../enums/PaymentMethod.Enum';
import { LegacyPromoCodeDocument } from '../models/LegacyPromoCode';
import { syncOrderRequest } from '../util/searchTools';
import { DeltaMachineStatus } from './DeltaMachineStatus';
import { AddOnsOrderSummary } from './Order';
import { PaymentProviderType } from './Payment';
import { deleteCache } from '../libs/redis';

export enum ShipmentServiceEnum {
  TOROD = 'torod',
  SMSA = 'SMSA',
}
export interface MatchConditionDMO {
  orderId?: mongoose.Types.ObjectId;
  statusId: Record<string, Array<unknown>>;
}

export interface DisputeReason {
  question?: Reason;
  answer?: Reason;
}

export interface Reason {
  en?: string;
  ar: string;
}

export interface DisputeData {
  disputeDate?: Date;
  isDisputeRaised?: boolean;
  hasDisputeRaisedBefore?: boolean;
  disputeReason?: DisputeReason[];
  description?: string;
  preferredContactNumber?: number;
  images?: any[];
}
export interface DeltaMachineOrderDocument extends Document {
  orderId: string;
  statusId?: string;
  trackingNumber?: string;
  reverseSMSATrackingNumber?: string;
  pickUpTrackingNumber?: string;
  pickUpAddOnsTrackingNumber?: string;
  paymentType?: PaymentProviderType;
  captureStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
  date?: Date;
  orderData?: OrderData;
  disputeData?: DisputeData;
  isAirTableSynched?: boolean;
  sendOutBoundMessage?: boolean;
  confirmationDeadline?: Date;
  payoutType?: DeltaMachinePayoutType;
  serviceId?: string;
  vendorId?: string;
  logistic?: string;
  isAvailableToPickup?: boolean;
  isProductRelisted?: boolean;
  isRiyadhSpecificPickup?: boolean;
  lastMileTrackingNumber?: string;
  postInspectionTrackingNumber?: string;
  shipmentService?: ShipmentServiceEnum;
}

export interface OrdersListResponse {
  total: number;
  limit: number;
  offset: number;
  data: DeltaMachineOrderDocument[];
}

export interface OrderData {
  buyerLongitude: string;
  buyerLatitude: string;
  sellerLongitude: string;
  sellerLatitude: string;
  isConsignment: boolean;
  financingFee?: number;
  conditionId?: string;
  productId: string;
  productName: string;
  inventoryId?: string;
  orderId?: string;
  trackingNumber?: string;
  reverseSMSATrackingNumber?: string;
  pickUpTrackingNumber?: string;
  orderType: OrderType;
  orderStatus: string;
  orderNumber: string;
  sellerPhone?: string;
  buyerPhone?: string;
  sellerCity?: string;
  buyerCity?: string;
  buyerName?: string;
  sellerName?: string;
  buyerPostalCode?: string;
  sellerPostalCode?: string;
  buyerAddress?: string;
  sellerAddress?: string;
  buyerStreet?: string;
  sellerStreet?: string;
  sellerSecretKey?: string;
  buyerDistrict?: string;
  sellerDistrict?: string;
  buyerPromoCode?: string;
  sellerPromoCode?: string;
  sellerBankName?: string;
  sellerAcountName?: string;
  sellerBankBIC?: string;
  sellerIBAN?: string;
  sellerType?: string;
  grandTotal: string;
  payoutAmount: string;
  sellPrice: string;
  shippingAmount?: string;
  commissionAmount?: string;
  vatAmount?: string;
  paymentStatus: string;
  paymentType: PaymentProviderType;
  createdAt: Date;
  varient?: string;
  productPictures?: string;
  sellerPromo?: LegacyPromoCodeDocument;
  buyerPromo?: LegacyPromoCodeDocument;
  sendOutBoundMessage?: boolean;
  sellerId?: string;
  buyerId?: string;
  deliveryFee?: number;
  productVarient?: string;
  questionsAndAnswers?: string;
  isKeySeller?: boolean;
  availableLogisticsServices?: string;
  modelId?: string;
  modelName?: string;
  categoryName?: string;
  brandName?: string;
  categoryId?: string;
  conditions?: any;
  grade?: string;
  productCondition?: string;
  price_quality_extra_commission?: number;
  transactionDetails?: string;
  captureStatus?: string;
  vatPercentage?: number;
  buyType?: string;
  dmoId?: string;
  variantId?: string;
  productNameAr?: string;
  confirmationDate?: Date;
  disputeDate?: Date;
  deliveryDate?: Date;
  listingGroupId?: string;
  shippingDate?: Date;
  returnWarranty?: string;
  addOnsSummary?: AddOnsOrderSummary;
  addOnsTotalAmount?: number;
  addOnsGrandTotal?: number;
  addOnsVat?: number;
  addOns?: string;
  addOnsValidity?: string;
  addOnsDescription?: string;
  paidAmount?: number;
  reservationAmount?: number;
  remainingAmount?: number;
  isReservation?: boolean;
  refundAmount?: number;
  isQuickPayout?: boolean;
  penalty?: number;
  isFinancing?: boolean;
  cancellationFee?: number;
  isUAEListing?: boolean;
  lastMileTrackingNumber?: string;
  postInspectionTrackingNumber?: string;
  productDescription?: string;
  buyerPromoCodeId?: string;
  replacedProductId?: string;
  replacedOrderId?: string;
  productImgs?: string[];
  failedInspectionLabel?: string;
  failedInspectionFlag?: boolean;
  isRated?: string;
  isConsignment?: boolean;
}

const deltaMachineOrderSchema = new Schema<DeltaMachineOrderDocument>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'orders',
    unique: true,
    required: true,
    dropDups: true,
  },
  statusId: {
    type: Schema.Types.ObjectId,
    ref: 'DeltaMachineStatuses',
    required: true,
  },
  trackingNumber: { type: String },
  lastMileTrackingNumber: { type: String },
  postInspectionTrackingNumber: { type: String },
  pickUpTrackingNumber: { type: String },
  pickUpAddOnsTrackingNumber: { type: String },
  reverseSMSATrackingNumber: { type: String },
  paymentType: { type: String, enum: PaymentProviderType },
  captureStatus: { type: String, default: DeltaMachineBNPLStatuses.CAPTURED },
  isAirTableSynched: { type: Boolean, default: false },
  orderData: { type: Object },
  disputeData: { type: Object },
  serviceId: { type: String },
  vendorId: { type: String },
  logistic: { type: String },
  isAvailableToPickup: { type: Boolean, default: false },
  isProductRelisted: { type: Boolean, default: false },
  isRiyadhSpecificPickup: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  sendOutBoundMessage: { type: Boolean },
  confirmationDeadline: {
    type: Date,
    default: () => {
      return getConfirmationDeadline(2, true);
    },
  },
  shipmentService: { type: String, default: ShipmentServiceEnum.SMSA },
});

deltaMachineOrderSchema.set('toJSON', {
  virtuals: true,
});
deltaMachineOrderSchema.set('toObject', {
  virtuals: true,
});

deltaMachineOrderSchema.virtual('payoutType');
// This will remove `_id` and `__v`
deltaMachineOrderSchema.plugin(mongooseHidden());
deltaMachineOrderSchema.plugin(paginate);

deltaMachineOrderSchema.post(
  ['save', 'deleteOne', 'updateOne', 'findOneAndUpdate'] as any[],
  async (doc: DeltaMachineOrderDocument, next) => {
    const dmStatus = await DeltaMachineStatus.findById(doc.statusId);
    await syncOrderRequest('single', {
      ...doc.toObject(),
      ...{ dmOrderId: doc.id, dmStatus: dmStatus?.name },
    } as unknown as OrderSyncDto);
    const key = `user_${doc.orderData.buyerId}_order_count`;
    await deleteCache(key);
    next();
  }
);
export const DeltaMachineOrder: Model<DeltaMachineOrderDocument> = model(
  'DeltaMachineOrders',
  deltaMachineOrderSchema,
  'DeltaMachineOrders'
);

export const getConfirmationDeadline = (
  numberOf: number,
  extraHourForWeekend = false
): Date => {
  const unit = 12; // Unit in hours
  const hours = numberOf * unit;
  const dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][moment().day()];
  const confirmationDeadline: Date =
    (dayOfWeek === 'Thursday' || dayOfWeek === 'Friday') && extraHourForWeekend
      ? moment()
          .add(2 * hours, 'h')
          .toDate()
      : moment().add(hours, 'h').toDate();

  return confirmationDeadline;
};

export const DeltaMachinePaginatedModel: PaginateModel<DeltaMachineOrderDocument> =
  model(
    'DeltaMachineOrders',
    deltaMachineOrderSchema,
    'DeltaMachineOrders'
  ) as any;
