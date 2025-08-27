const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const BankModel = require('../../../models/BankModel.js');
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
const settingDAL = require('../../../Data/SettingDAL')

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
//var CatUpload = Helper.upload_space().array('category_icon', 1);
var CatUpload = Helper.upload_space("category").single('category_icon');

const BankApis = {
	"AllBankList": (req, res) => {
		let query = { 'status': 'Active' };
		if (req.query.like) {
			var searchObject = {
				$or: [{ 'bankCode': { $regex: req.query.like, $options: 'i' } },
				{ 'bankName': { $regex: req.query.like, $options: 'i' } }
				]
			};
			Object.assign(query, searchObject);
		}
		//let limit = parseInt(req.query.limit);

		let col = { _id: 0, bankName: 1, bankName_ar: 1, bankCode: 1, isNonSaudiBank: 1 };
		BankModel.find(query, col, {lean : 1}, function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				//let returnedCategory = [];
				//for (let i = 0; i < result.length; i++) {
				//result[i].category_icon = ENV.HOST+"/category/"+result[i].category_icon;
				//	returnedCategory.push(result[i].transform());
				//}
				result.map((item) => {
					if (LOCALE == "ar") {
						item.bankName = item.bankName_ar;
					}
				});
				var result = { "bankList": result };
				Helper.response(res, 200, Messages.bank.list[LOCALE], result);
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},

	"AddBank": async (req, res) => {
		try {
			// Read bank.json file 
			let bankListFileName = "";
			const region = await settingDAL.SettingValue("region");
			if (region.region==="SA"){
				bankListFileName = "bank-list.json";
			}
			if (region.region==="AE"){
				bankListFileName = "bank-list-ae.json";
			}
			fs.readFile(bankListFileName, function (err, data) {
				// Check for errors 
				if (err) throw err;
				// Converting to JSON 
				const banks = JSON.parse(data);
				//console.log(JSON.stringify(users.surveyData)); // Print users  
				var bankData = banks.bankList;
				bankData.map(function (item) {
					BankModel.findOne({ bankCode: item.bankCode }, (err, bankResult) => {
						if (err) {
							Helper.response(res, 500, Messages.api.fail[LOCALE]);
						} else if (!bankResult) {
							let bank = new BankModel(item);
							bank.save((error, result) => {
								if (error) { console.log(Messages.api.fail[LOCALE]); }
								else {
									//Helper.response(res, 200, "Bank added");
									console.log("added")
								}
							})
						} else {
							// console.log(bankResult);
							if (item && item.bankName_ar) {
								bankResult.bankName_ar = item.bankName_ar;
							}

							if (item && item.status) {
								bankResult.status = item.status;
							}
							bankResult.save((error, result) => {
								if (error) { console.log(Messages.api.fail[LOCALE]); }
								else {
									console.log("updated")
								}
							})
						}
					})
				})
			});
		} catch (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}
	}
}

module.exports = BankApis;
