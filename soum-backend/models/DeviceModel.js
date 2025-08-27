const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

var DeviceModelSchema = new Schema({
    category_id: { type: Schema.Types.ObjectId,ref:"categories" },
    brand_id: { type: Schema.Types.ObjectId,ref:"brands" },
    model_name: { type: String },
    model_name_ar: { type: String, default: "" },
    model_icon: { type: String },
    // current_price: { type: Number },
    questions: { type: Array, default:[] },
    position: { type: Number, default: 0 },
    status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
    created_at: { type: Date, default: Date.now()},
    updated_at: { type: Date, default: Date.now()}
});

DeviceModelSchema.method('transform', function() {
    var obj = this.toObject();
    //Rename fields
    obj.model_id = obj._id;
    delete obj._id;
    return obj;
});

DeviceModelSchema.plugin(mongoosePaginate);
const Device = mongoose.model('device_models', DeviceModelSchema, 'device_models');
module.exports = Device;
