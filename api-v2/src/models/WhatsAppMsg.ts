// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export interface WhatsAppMsgInput {
  requestId?: string;
  outboundMessageId?: string;
  lang?: string;
  templateName?: string;
  status?: string;
  productId?: string;
  orderId?: string;
  userId?: string;
  orderNumber?: string;
  phoneNumber?: string;
}

export interface WhatsAppMsgDocument extends Document {
  requestId?: string;
  outboundMessageId?: string;
  lang?: string;
  templateName?: string;
  templateType?: string;
  status?: string;
  dmoId?: string;
  productId?: string;
  orderId?: string;
  userId: string;
  freshchatUserId?: string;
  freshchatConversationId?: string;
  orderNumber: string;
  phoneNumber?: string;
  userResponse?: string;
  userResponses?: string[];
  productUFRLabels?: string[];
  productUFRLabel?: string;
  userUnavailabilityResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const whatsAppMsgSchema = new Schema<WhatsAppMsgDocument>({
  requestId: { type: String },
  outboundMessageId: { type: String },
  lang: { type: String, default: 'ar' },
  templateName: { type: String },
  templateType: { type: String, default: '' },
  status: { type: String },
  dmoId: { type: Schema.Types.ObjectId, ref: 'DeltaMachineOrders' },
  productId: { type: Schema.Types.ObjectId, ref: 'products' },
  orderId: { type: Schema.Types.ObjectId, ref: 'orders' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  orderNumber: { type: String },
  phoneNumber: { type: String },
  userResponse: { type: String, default: '' },
  userResponses: { type: Array, default: [] },
  productUFRLabels: { type: Array, default: [] },
  productUFRLabel: { type: String, default: '' },
  userUnavailabilityResponse: { type: String, default: '' },
  freshchatUserId: { type: String, default: '' },
  freshchatConversationId: { type: String, default: '' },
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
});

whatsAppMsgSchema.pre('findOneAndUpdate', function () {
  this.findOneAndUpdate({}, { $set: { updatedAt: new Date() } });
});

whatsAppMsgSchema.set('toJSON', {
  virtuals: true,
});
whatsAppMsgSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
whatsAppMsgSchema.plugin(mongooseHidden());
export const WhatsAppMsg: Model<WhatsAppMsgDocument> = model(
  'WhatsAppMsg',
  whatsAppMsgSchema,
  'WhatsAppMsg'
);
