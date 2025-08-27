const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', false);


const AdminSchema = new Schema({
	name: {
		type: String
	},
	email: {
		type: String
	},

	password: {
		type: String
	},


	profilePic:
		{ type: String },

	phoneNumber:
		{ type: String },

	token: {
		type: String
	},

	resetToken: {
		type: String, default:''
	},
	role: {
		type: String,
		enum: ["admin", "superadmin"],
		uppercase: false
	},
	emailOtp: { type: String, default:'' }, 
	status: { type: String, enum: ['Inactive', 'Active', 'Delete'], default: 'Active' },
	updatedDate: { type: Date, default: Date.now },
	createdDate: { type: Date, default: Date.now },
	lastLoginDate: { type: Date, default: Date.now },
	isBetaAdmin: { type: Boolean, default: false },
})


AdminSchema.plugin(mongoosePaginate);
const Admin = mongoose.model('admin', AdminSchema, 'admins');
module.exports = Admin;

mongoose.model('admin', AdminSchema, 'admins').findOne({ role: "superadmin" }, (err, result) => {
	if (err) {
		console.log("error in admin creation");
	}
	else if (result) {
		console.log("default Admin");
	} else {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync("admin@4321", salt);
		let obj = {
			email: "admin@soum.com",
			password: hash,
			name: "Admin",
			role: "superadmin"
		}
		new mongoose.model('admin', AdminSchema, 'admins')(obj).save((adminErr, adminResult) => {
			if (adminErr) {
				console.log(adminErr);
			}
			else {
				console.log("default Admin added successfully.");
			}
		})
	}
})

