const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

const paymentSchema = mongoose.Schema({
  payment_provider: { type: String, enum: ['hyperPay'] },
  payment_provider_type: { type: String, enum: ['APPLEPAY', 'MADA', 'VISA_MASTER', 'STC_PAY', 'URPAY'] },
  payment_action_type: { type: String, enum: ['listingFees'] },
  payment_completeness: { type: String, enum: ['partial', 'full'] },
  soum_payment_type: { type: String, enum: ['onlineProvider', 'cashOnDelivery'] },
  payment_input: { type: Object },
  payment_response: { type: Object },
  checkout_payment_response: { type: Object },
  payment_status: { type: String, enum: ['Pending', 'Completed', 'Failed'] },
  checkout_payment_status: { type: String, enum: ['Pending', 'Completed', 'Failed'] },
  created_date: { type: Date, default: Date.now },
});

paymentSchema.plugin(mongoosePaginate);
const Payment = mongoose.model('Payment', paymentSchema, 'Payment');
module.exports = Payment;
