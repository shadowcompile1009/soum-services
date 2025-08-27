const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

const SettingSchema = new Schema({
    skip_defect_photos: { type: Boolean, default: false },
    product_approval: { type: Boolean, default: true },
    theme_color: { type: String, default: "01B9FF" },
    buyer_commission_percentage: { type: Number, default: 10 },
    seller_commission_percentage: { type: Number, default: 10 },
    shipping_charge_percentage: { type: Number, default: 10 },
    shipping_charge_percentage: { type: Number, default: 10 },
    start_bid_percentage: { type: Number, default: 75 },
    vat_percentage: { type: Number, default: 10 },
    bidding_amount: { type: Number, default: 20 },
    referral_discount_type: { type: String, enum: ['Fixed', 'Percentage'], default: 'Fixed' },
    referral_fixed_amount: { type: Number , default :100},
    referral_percentage: { type: Number, default: 0 },
    referral_credit_type: { type: String, enum: ['Seller', 'Buyer'], default: 'Seller' },
    referral_credit_amount: { type: Number, default: 200 },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
})

const setting = mongoose.model('setting', SettingSchema, 'setting')
module.exports = setting
