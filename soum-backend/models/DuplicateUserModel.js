
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
const { user } = require('../config/messages');
mongoose.set('debug', true);

const DuplicateUserSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, ref:"user" },
	mobileNumber: { type: String },
	status: { type: String},
	newStatus: { type: String},
	updatedDate: { type: Date, default: Date.now },
	createdDate: { type: Date, default: Date.now },
	primary_account: { type: String }
})

DuplicateUserSchema.plugin(mongoosePaginate);
const duplicateUsers = mongoose.model('duplicateUser', DuplicateUserSchema, 'duplicateUsers');
module.exports = duplicateUsers;