const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

var BankSchema = new Schema({
    bankName: { type: String },
    bankName_ar: { type: String },
    bankCode: { type: String },
    status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
    isNonSaudiBank: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now()},
    updated_at: { type: Date, default: Date.now()}
});

BankSchema.method('transform', function() {
    var obj = this.toObject();
    //Rename fields
    obj.bank_id = obj._id;
    delete obj._id;
    return obj;
});

BankSchema.plugin(mongoosePaginate);
const Bank = mongoose.model('banks', BankSchema, 'banks');
module.exports = Bank;
