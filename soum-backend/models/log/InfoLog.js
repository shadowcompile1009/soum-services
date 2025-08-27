const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');

var infoLogSchema = new Schema({
    data: { type: Object },
    type: { type: String },
    created_at: { type: Date, default: () => { return new Date() } },
    updated_at: { type: Date, default: () => { return new Date() } }
});


infoLogSchema.plugin(mongoosePaginate);
const infoLog = mongoose.model('infoLog', infoLogSchema, 'infoLog');
module.exports = infoLog;