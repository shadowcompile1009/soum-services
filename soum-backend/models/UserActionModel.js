const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');

const UserActionSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "user" },
	actionType: { type: String },
	referenceId: { type: String },
	actionId: { type: Schema.Types.ObjectId},
	status: { type: Boolean, default: false },
	updatedDate: { type: Date, default: Date.now },
	createdDate: { type: Date, default: Date.now },
})

UserActionSchema.plugin(mongoosePaginate);
const UserAction = mongoose.model('user_action', UserActionSchema, 'UserActions');
module.exports = UserAction;
