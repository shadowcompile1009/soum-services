const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

var BrandModelSchema = new Schema({
    category_id: { type: Schema.Types.ObjectId,ref:"categories" },
    brand_id: {type: Schema.Types.ObjectId},
    brand_name: { type: String },
    brand_name_ar: { type: String, default: "" },
    brand_icon: { type: String, default: "" },
    position: { type: Number, default: 0 },
    add_ons: { type: Array, default: [] },
    is_add_on_enabled: { type: Boolean, default: false },
    status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
});

BrandModelSchema.method('transform', function() {
    var obj = this.toObject();
    //Rename fields
    obj.brand_id = obj._id;
    delete obj._id;
    return obj;
});

const Brand = mongoose.model('brands', BrandModelSchema, 'brands');
module.exports = Brand;
