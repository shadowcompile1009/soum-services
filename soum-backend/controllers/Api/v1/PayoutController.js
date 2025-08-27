const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const OrderModel = require('../../../models/OrderModel.js');
const Helper = require('../../../config/helper.js');
const Messages = require('../../../config/messages.js');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const express = require('express');
//const app = express();
//app.use(express.static(path.join(__dirname, 'emailTemplates')));
const nunjucks = require('nunjucks');
const multer = require('multer');
const ejs = require('ejs');
const ObjectId = mongoose.Types.ObjectId;
//mongoose.Types.ObjectId

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './assets/category');
	},
	filename: function (req, file, callback) {
		let extArray = file.mimetype.split("/");
		let extension = extArray[extArray.length - 1];
		var fileExt = path.extname(file.originalname);
		var fileName = file.originalname;
		fileName = fileName.split(".");
		fileName = fileName[0];
		//fileName.splice(-1, 1);
		//fileName.join('');
		fileName = fileName.replace(" ", "-");
		fileName = fileName + '-' + new Date().getTime();
		var data = fileName + fileExt;
		//console.log("in data--->>>", data);
		callback(null, data);
	}
});

var Upload = multer({ storage: storage }).single('category_icon');

const PayoutApis = {
	"HyperSplitPayoutNotification": async (req, res) => {
		try {
			var crypto = require("crypto");
			var body = req.body;
			var headers = req.headers;
			console.log("headers", headers);
			console.log("body", body);
			// Data from configuration
			var secretFromConfiguration = ENV.HYPER_PAY_NOTIFICATION_KEY; //"97BD52E82DF7F18E86872F7E7F6B82FFC3CB98F0FDB6D88E02FF1F41B5A52B92";
			// Data from server
			var ivfromHttpHeader = headers['x-initialization-vector']; //"000000000000000000000000";
			var authTagFromHttpHeader = headers['x-authentication-tag']; //"CE573FB7A41AB78E743180DC83FF09BD";
			var httpBody = body.encryptedBody; //"0A3471C72D9BE49A8520F79C66BBD9A12FF9";
			// Convert data to process
			var key = new Buffer(secretFromConfiguration, "hex");
			var iv = new Buffer(ivfromHttpHeader, "hex");
			var authTag = new Buffer(authTagFromHttpHeader, "hex");
			var cipherText = new Buffer(httpBody, "hex");
			// Prepare descryption
			var decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
			decipher.setAuthTag(authTag);
			// Decrypt
			var result = decipher.update(cipherText) + decipher.final();
			console.log(result);
			var jsonRes = JSON.parse(result);
			if (typeof jsonRes.data.transactions != "undefined" && jsonRes.data.transactions.length > 0) {
				jsonRes.data.transactions.map(function (item) {
					if (typeof item.uniqueId != "undefined") {
						var transaction_id = item.uniqueId;
						OrderModel.updateOne({ transaction_id: transaction_id }, { $set: { "payout_notification_detail": result } }, function (err, success) {
							if (err) {
								console.log(err);
								return Helper.response(res, 200, Messages.api.error[LOCALE]);
							} else {
								Helper.response(res, 200, Messages.api.success[LOCALE]);
							}
						});
					} else {
						Helper.response(res, 200, Messages.api.success[LOCALE]);
					}
				})
			}
		} catch (error) {
			console.log(error);
			Helper.response(res, 200, Messages.api.fail[LOCALE]);
		};
	},
}

module.exports = PayoutApis;
