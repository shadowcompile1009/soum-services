const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

const VarientSchema = new Schema({
    category_id: { type: Schema.Types.ObjectId,ref:"categories" },
    brand_id: { type: Schema.Types.ObjectId,ref:"brands" },
    model_id: { type: Schema.Types.ObjectId,ref:"device_models" },
    varient: { type: String },
    varient_ar: { type: String, default: "" },
    current_price: { type: Number },
    position: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    created_at: { type: Date, default: Date.now()},
    updated_at: { type: Date, default: Date.now()}
})

 const varient = mongoose.model('varients', VarientSchema)
 module.exports = varient
