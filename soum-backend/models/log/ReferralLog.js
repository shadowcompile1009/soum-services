const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var referralLogSchema = new Schema({
    action_type: { type: String, enum: ['Create', 'Use', 'Update', 'Gain', 'Reimburse']},
    referral_code: { type: String },
    user_name: { type: String },
    mobile_number: { type: String },
    user_id: { type: Schema.Types.ObjectId, required: false, ref: "user" },
    details: { type: Object },
    created_at: { type: Date, default: () => { return new Date() } },
    updated_at: { type: Date, default: () => { return new Date() } }
});


referralLogSchema.plugin(mongoosePaginate);
const referralLog = mongoose.model('referralLog', referralLogSchema, 'referralLog');
module.exports = referralLog;