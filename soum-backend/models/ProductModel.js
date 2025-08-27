const mongoose = require("mongoose");
const { Schema } = mongoose;
var mongoosePaginate = require("mongoose-paginate");
const {
  ACTIVE,
  DELETE,
  ONHOLD,
  REJECT,
  IDLE,
  INACTIVE,
} = require("../enums/ProductStatus");

const { CONSUMER, IMS, MERCHANT } = require("../enums/ListingSource");
mongoose.set("debug", false);
const productSchema = mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, required: false, ref: "user" },
  category_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "categories",
  },
  brand_id: { type: Schema.Types.ObjectId, required: true, ref: "brands" },
  model_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "device_models",
  },
  condition_id: { type: String },
  product_images: [{ type: String, default: "" }],
  defected_images: [{ type: String, default: "" }],
  varient: { type: String, required: true },
  varient_id: { type: Schema.Types.ObjectId, required: false, ref: "varients" },
  varient_ar: { type: String, required: false },
  body_cracks: { type: String, enum: ["no", "yes"], required: true },
  sell_price: { type: Number, required: true },
  bid_price: { type: Number, required: true },
  description: { type: String, default: "" },
  answer_to_questions: { type: String, default: "" },
  answer_to_questions_ar: { type: String, default: "" },
  answer_to_questions_migration: { type: String, default: "" },
  answer_to_questions_ar_migration: { type: String, default: "" },
  grade: { type: String, default: "" },
  grade_ar: { type: String, default: "" },
  score: { type: Number, default: 0 },
  pick_up_address: { type: Object, default: {} },
  bidding: { type: Array, default: [] },
  save_as_draft_step: { type: String, default: "" },
  current_bid_price: { type: Number, default: "" },
  favourited_by: { type: Array, default: [] },
  status: {
    type: String,
    enum: [INACTIVE, ACTIVE, DELETE, ONHOLD, REJECT, IDLE],
    default: ACTIVE,
  },
  sell_status: {
    type: String,
    enum: ["Sold", "Locked", "Available", "Draft", "Refunded"],
    default: "Available",
  },
  isApproved: { type: Boolean, default: true },
  isExpired: { type: Boolean, default: false },
  isListedBefore: { type: Boolean, default: false },
  isUserNotifiedForExpiry: { type: Boolean, default: false },
  code: { type: String },
  promocode: { type: Schema.Types.ObjectId, required: false, ref: "promocode" },
  updatedDate: { type: Date, default: Date.now },
  createdDate: { type: Date },
  expiryDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  actionDates: { type: Array, default: [] },
  deletedDate: { type: Date },
  deletedBy: { type: String },
  auto_approve_at: { type: Date },
  approve_source: { type: String },
  billingSettings: { type: Object },
  search_sync: { type: String },
  recommended_price: { type: Number },
  isBiddingProduct: { type: Boolean, default: false },
  trade_in: { type: Boolean, default: false },
  trade_in_status: { type: String, default: "InProgress" },
  listingSource: {
    type: String,
    enum: [CONSUMER, IMS, MERCHANT],
    default: CONSUMER,
  },
  isConsignment: { type: Boolean, default: false },
});
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Product", productSchema);
