const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

var paymentLogsSchema = new Schema({
    data: { type: String },
    created_at: { type: Date, default: () => { return new Date() } },
    updated_at: { type: Date, default: () => { return new Date() } }
});

paymentLogsSchema.plugin(mongoosePaginate);
const paymentLogs = mongoose.model('paymentLogs', paymentLogsSchema, 'paymentLogs');
module.exports = paymentLogs;
