const mongoose = require('mongoose');
const { Schema } = mongoose;
const conn = require('../../config/log-connection')
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);
const logProductSchema = mongoose.Schema({
    product_Id : { type: Schema.Types.ObjectId },
    user_id: { type: Schema.Types.ObjectId, required: false, ref: "user" },
    category_id: { type: Schema.Types.ObjectId, required: true, ref: "categories" },
    brand_id: { type: Schema.Types.ObjectId, required: true, ref: "brands" },
    model_id: { type: Schema.Types.ObjectId, required: true, ref: "device_models" },
    product_images: [{ type: String, default: '' }],
    defected_images: [{ type: String, default: '' }],
    varient: { type: String, required: true },
    varient_ar: { type: String, required: false },
    body_cracks: { type: String, enum: ['no', 'yes'], required: true },
    sell_price: { type: Number, required: true },
    bid_price: { type: Number, required: true },
    description: { type: String, default: "" },
    answer_to_questions: { type: String, default: "" },
    answer_to_questions_ar: { type: String, default: "" },
    grade: { type: String, default: "" },
    score: { type: Number, default: 0 },
    pick_up_address: { type: Object, default: {} },
    bidding: { type: Array, default: [] },
    current_bid_price: { type: Number, default: "" },
    favourited_by: { type: Array, default: [] },
    status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
    sell_status: { type: String, enum: ['Sold', 'Locked', 'Available'], default: 'Available' },
    isApproved: { type: Boolean, default: true },
    isExpired: { type: Boolean, default: false },
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date },
    logDate: { type: Date, default: Date.now },
    logType: { type: String},
});
logProductSchema.plugin(mongoosePaginate);
const LogProductModel = conn.GetDbConnection().model('product-history', logProductSchema);
module.exports = LogProductModel;