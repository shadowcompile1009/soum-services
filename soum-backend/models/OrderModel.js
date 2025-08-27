const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate-v2");
mongoose.set("debug", true);
var OrderSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  seller: { type: Schema.Types.ObjectId, ref: "user" },
  buyer: { type: Schema.Types.ObjectId, ref: "user" },
  buyer_address: { type: Object },
  buy_amount: { type: Number },
  shipping_charge: { type: Number },
  discount: { type: Number, default: 0 },
  vat: { type: Number },
  commission: { type: Number },
  seller_commission: { type: Number, default: 0 },
  seller_vat: { type: Number, default: 0 },
  seller_grand_total: { type: Number },
  grand_total: { type: Number },
  checkout_id: { type: String, default: "" },
  order_number: { type: String, default: "" },
  payment_type: { type: String, default: "" },
  transaction_id: { type: String, default: "" },
  return_reason: { type: String, default: "" },
  dispute_comment: { type: String, default: "" },
  dispute_validity: { type: String, default: "" },
  dispute_date: { type: Date },
  transaction_detail: { type: String, default: "" },
  shipment_detail: { type: Object, default: {} },
  pickup_detail: { type: Object, default: {} },
  split_payout_detail: { type: Object, default: {} },
  track_detail: { type: Object, default: {} },
  payout_notification_detail: { type: Object, default: {} },
  transaction_status: {
    type: String,
    enum: ["Pending", "Success", "Fail"],
    default: "Pending",
  },
  paymentReceivedFromBuyer: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
  paymentMadeToSeller: { type: String, enum: ["Yes", "No"], default: "No" },
  buy_type: { type: String, enum: ["Direct", "Bid"], default: "Direct" },
  down_payment_details: { type: Object, default: null },
  dispute: { type: String, enum: ["Yes", "No"], default: "No" },
  status: {
    type: String,
    enum: ["Inactive", "Active", "Delete", "Delivered"],
    default: "Active",
  },
  delivery_time: { type: Date },
  delivery_desc: { type: String, default: "" },
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
  sourcePlatform: { type: String, default: "" },
  gtmClientId: { type: String, default: "" },
  gtmSessionId: { type: String, default: "" },
  bid_id: { type: String, default: "" },
  seller_payout_detail: { type: Object, default: {} },
  order_refund_status: {
    type: Object,
    default: {
      refund: false,
    },
  },
  last_payout: { type: String, default: "" },
  billingSettings: { type: Object },
  addOns: { type: Object, default: null },
  isReservation: { type: Boolean, default: false },
  isFinancing: { type: Boolean, default: false },
  isConsignment: { type: Boolean, default: false },
});

OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Order", OrderSchema);
