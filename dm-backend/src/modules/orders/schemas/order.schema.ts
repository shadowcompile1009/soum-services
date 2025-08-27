import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Document, isValidObjectId } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { PaymentProviderType, PayoutType } from '../enums/payment.enum';
import {
  DeltaMachineBNPLStatuses,
  DeltaMachineFEStatus,
} from '../enums/status.enum';
import { OrderData } from '../intefaces/order.interface';
import { UserData } from '../intefaces/user.interface';

export type OrderSchemaDocument = Order & Document;

@Schema({
  collection: 'orders',
})
export class Order {
  @Prop({
    validate: isValidObjectId,
  })
  id: mongoose.Types.ObjectId;

  @Prop({
    validate: isValidObjectId,
    required: true,
    unique: true,
    dropDups: true,
  })
  orderId: mongoose.Types.ObjectId;

  @Prop({
    validate: isValidObjectId,
    ref: 'Status',
    required: true,
  })
  statusId: mongoose.Types.ObjectId;

  @Prop({
    ref: 'Status',
    default: '',
  })
  disputeStatusId: mongoose.Types.ObjectId;

  @Prop({
    ref: 'Status',
    default: '',
  })
  refundStatusId: mongoose.Types.ObjectId;

  @Prop({
    ref: 'Status',
    default: '',
  })
  payoutStatusId: mongoose.Types.ObjectId;

  @Prop({
    default: '',
  })
  trackingNumber: string;

  @Prop({
    default: '',
  })
  postInspectionTrackingNumber: string;

  @Prop({
    default: '',
  })
  lastMileTrackingNumber: string;

  @Prop({
    default: '',
  })
  pickUpTrackingNumber: string;

  @Prop({
    default: '',
  })
  pickUpAddOnsTrackingNumber: string;

  @Prop({
    default: '',
  })
  reverseSMSATrackingNumber: string;

  @Prop({ default: false })
  isAirTableSynched: boolean;

  @Prop({
    default: '',
  })
  serviceId: string;

  @Prop({
    default: '',
  })
  vendorId: string;

  @Prop({
    default: '',
  })
  logistic: string;

  @Prop({
    type: String,
    enum: PaymentProviderType,
    default: '',
  })
  paymentType: string;

  @Prop({
    type: String,
    enum: DeltaMachineBNPLStatuses,
    default: DeltaMachineBNPLStatuses.CAPTURED,
  })
  captureStatus: string;

  @Prop({
    type: String,
    enum: DeltaMachineFEStatus,
    default: DeltaMachineFEStatus.NOT_REQUESTED,
  })
  refundStatus: string;

  @Prop({
    type: String,
    enum: DeltaMachineFEStatus,
    default: DeltaMachineFEStatus.NOT_REQUESTED,
  })
  payoutStatus: string;

  @Prop({
    type: String,
    enum: DeltaMachineFEStatus,
    default: DeltaMachineFEStatus.NO_DISPUTE,
  })
  disputeStatus: string;

  @Prop({
    type: String,
    enum: PayoutType,
    default: PayoutType.PAYOUT,
  })
  payoutType: string;

  @Prop({ default: false })
  isAvailableToPickup: boolean;

  @Prop({ default: false })
  isProductRelisted: boolean;

  @Prop({ default: false })
  isRiyadhSpecificPickup: boolean;

  @Prop({ default: false })
  sendOutBoundMessage: boolean;

  @Prop({
    type: Object,
  })
  orderData: OrderData;

  @Prop({
    type: Object,
  })
  disputeData: Object;

  @Prop({
    type: Object,
  })
  userData: UserData;

  @Prop({
    default: () => {
      return getConfirmationDeadline(2, true);
    },
  })
  confirmationDeadline: Date;

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

export const getConfirmationDeadline = (
  numberOf: number,
  extraHourForWeekend = false,
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

export const OrderSchema = SchemaFactory.createForClass(Order)
  .set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toHexString();
    },
  })
  .set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toHexString();
    },
  })
  .index({ '$**': 'text' });

OrderSchema.plugin(paginate);
