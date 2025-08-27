
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
const { user } = require('../config/messages');
mongoose.set('debug', true);

const UserSchema = new Schema({
	name: { type: String },
	lastName: { type: String },
	email: { type: String },
	mobileNumber: { type: String },
	password: { type: String },
	otp: { type: String },
	otpTime: { type: Number, default: Date.now() },
	otpVerification: { type: Boolean, default: false },
	profilePic: { type: String, default: "" },
	countryCode: { type: String },
	secretKey: { type: String, default: "" },
	language: { type: String, default: "en" },
	address: { type: Object, default: {} },
	cards: { type: Array, default: [] },
	bankDetail: { type: Object, default: {} },
	token: { type: Array, default: [] },
	loginWith: {
		type: String,
		enum: ['facebook', 'instagram', 'manual', 'google'],
		default: 'manual'
	},
	status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
	updatedDate: { type: Date, default: Date.now },
	createdDate: { type: Date, default: Date.now },
	deleted_date: { type: Date, default: null },
	lastLoginDate: { type: Date, default: Date.now },
	userType: { type: String, enum: ['Normal', 'Dummy'], default: 'Normal' },
	referralCode: { type: String },
	referralCodeUsed: { type: Boolean, default: false },
	addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
	cleaned: { type: String },
	isBetaUser: {type: Boolean, default: false},
	isKeySeller: {type: Boolean, default: false},
    isMerchant: { type: Boolean, default: false },
	primary_account: { type: String },
	rates: {
		cancellation_rate: { type: Number, default: 0 },
		completion_rate: { type: Number, default: 0 },
		reliability_badge: { type: Boolean, default: false },
},
	rates_scan: { type: Boolean, default: true },
	listings: {
		sold_listings: { type: Number, default: 0 },
		active_listings: { type: Number, default: 0 },
		completed_sales: { type: Number, default: 0 },
		purchased_products: { type: Number, default: 0 },
	},
	preferences: {
		skip_pre_listing: { type: Boolean, default: false },
		skip_post_listing: { type: Boolean, default: false },
		is_wallet_first_visit: { type: Boolean, default: true },
		is_new_badge_alert: { type: Boolean, default: false },
		is_cancellation_alert: { type: Boolean, default: false },
		is_penalized_alert: { type: Boolean, default: false },
	},
	// isMerchant, isBetaUser and isKeySeller will be treated as techdebt
	// need to identify the affected areas before migrating
	sellerType: {
		type: Object, default: {
			isMerchant: false,
			isBetaUser: false,
			isKeySeller: false,
			isUAE: false,
			isCompliant: false,
		}
	},
	bio: { type: String, default: null },
})

UserSchema.plugin(mongoosePaginate);
const users = mongoose.model('user', UserSchema, 'users');
module.exports = users;