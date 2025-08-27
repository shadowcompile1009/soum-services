const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var PromocodeSchema = new Schema({
    userType: { type: String, enum: ['Seller', 'Buyer'], default: 'Seller' },
    promoType: { type: String, enum: ['Fixed', 'Percentage'], default: 'Percentage' },
    promoGenerator: { type: String, enum: ['Admin', 'Referral'], default: 'Admin' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    code: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    discount: { type: Number },
    percentage: { type: Number },
    totalGainedCredit: { type: Number, default: 0 },
    totalReimburseCredit: { type: Number, default: 0 },
    netRemainingCredit: { type: Number, default: 0 },
    fromDate: { type: Date, default: () => { return new Date() } },
    toDate: { type: Date, default: () => { return new Date() } },
    createdDate: { type: Date, default: () => { return new Date() } },
    updatedDate: { type: Date, default: () => { return new Date() } },
    promoSellerUsageCount: { type: Number, default: 0 },
    promoBuyerUsageCount: { type: Number, default: 0 },
    totalUsage: { type: Number, default: 0 },
    promoLimit: { type: Number, default: 0 },
    availablePayment:  { type: Array, default: [] },
    isDefault:  { type: Boolean, default: false },
    promoCodeScope : { type: Array, default: [] },  // {promoCodeScopeType : [], ids : []}
});

PromocodeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Promocode', PromocodeSchema);