const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');

var paymentStatusSchema = new Schema({
    data: { type: String },
    type: { type: String },
    created_at: { type: Date, default: () => { return new Date() } },
});


paymentStatusSchema.plugin(mongoosePaginate);
const paymentStatus = mongoose.model('paymentStatus', paymentStatusSchema, 'paymentStatus');
module.exports = paymentStatus;
