const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);

var CategoryModelSchema = new Schema({
    category_name: { type: String },
    category_name_ar: { type: String, default: "" },
    category_icon: { type: String },
    mini_category_icon: { type: String },
    image:{ type: String },
    position:{ type: Number, default : 0 },
    status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
    created_at: { type: Date, default: Date.now()},
    updated_at: { type: Date, default: Date.now()}
});

CategoryModelSchema.method('transform', function() {
    var obj = this.toObject();
    //Rename fields
    obj.category_id = obj._id;
    delete obj._id;
    return obj;
});

CategoryModelSchema.plugin(mongoosePaginate);
const Category = mongoose.model('categories', CategoryModelSchema, 'categories');
module.exports = Category;
