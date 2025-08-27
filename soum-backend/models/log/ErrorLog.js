const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');

var errorLogSchema = new Schema({
    data: { type: Object },
    controller: { type: String },
    method_name: { type: String },
    status_code: { type: Number },
    params: { type: Object },
    created_at: { type: Date, default: () => { return new Date() } },
    updated_at: { type: Date, default: () => { return new Date() } }
});


errorLogSchema.plugin(mongoosePaginate);
const errorLog = mongoose.model('errorLog', errorLogSchema, 'errorLog');
module.exports = errorLog;