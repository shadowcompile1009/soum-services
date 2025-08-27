const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const DeviceModel = require('../../models/DeviceModel.js');
const QuestionModel = require('../../models/QuestionModel.js');
const VarientModel = require('../../models/VarientModel.js');
const Helper = require('../../config/helper.js');
const Messages = require('../../config/messages.js');
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
		callback(null, './assets/models');
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

var Upload = multer({ storage: storage }).single('model_icon');
var UploadMultiple = multer({ storage: storage }).array('model_icon', 10);

const VarientApis = {
	"AllVarientList": async (req, res) => {
		let brand_id = req.query.brand_id
		let category_id = req.query.category_id
		let model_id = req.query.model_id

		let query = { 'status': 'Active' };
		if (typeof brand_id !== "undefined") {
			query.brand_id = ObjectId(brand_id);
		}
		if (typeof category_id !== "undefined") {
			query.category_id = ObjectId(category_id);
		}
		if (typeof model_id !== "undefined") {
			query.model_id = ObjectId(model_id);
		}
		if (req.query.like) {
			var searchObject = {
				$or: [{ 'varient': { $regex: req.query.like, $options: 'i' } },
				]
			};
			Object.assign(query, searchObject);
		}
		let limit = parseInt(req.query.limit);

		let col = { _id: 1, varient_id: '$_id', varient: 1, varient_ar: 1, category_id: 1, brand_id: 1, model_id: 1, position: 1, current_price: 1 };
		VarientModel.find(query, col, { sort: { position: 1 } }, async function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				var resultData = { "varientList": result };
				Helper.response(res, 200, Messages.model.list[LOCALE], resultData);
			}
		}).catch(function (error) {
			console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},

	"AddVarient": (req, res) => {
		try {
			//console.log(req.body); return false;
			var where = { 'varient': new RegExp("^" + req.body.varient + "$", "i"), "brand_id": req.body.brand_id, "model_id": { $eq: req.body.model_id }, 'status': { $ne: 'Delete' } };
			VarientModel.findOne(where, function (err, varientExist) {
				console.log(varientExist);
				if (!varientExist) {
					let category_id = req.body.category_id;
					let brand_id = req.body.brand_id;
					let model_id = req.body.model_id;
					let current_price = req.body.current_price;
					//let model_icon = req.body.model_icon;
					var modObject = {
						category_id: category_id,
						brand_id: brand_id,
						model_id: model_id,
						varient: req.body.varient,
						varient_ar: req.body.varient_ar,
						current_price,
					};
					//console.log(modObject); return false;
					let Varient = new VarientModel(modObject);
					Varient.save((error, result) => {
						if (error) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
						else {
							Helper.response(res, 200, Messages.variant.added[LOCALE]);
						}
					});
				} else {
					Helper.response(res, 400, Messages.variant.exists[LOCALE]);
				}
			});

		} catch (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}

	},

	"EditVarient": (req, res) => {
		try {
			let varient_id = req.params.varient_id;
			VarientModel.findOne({ varient: new RegExp("^" + req.body.varient + "$", "i"), "model_id": { $eq: req.body.model_id }, 'status': { $ne: 'Delete' }, _id: { $ne: varient_id } }, (error, result) => {
				if (error) {
					return Helper.response(res, 500, Messages.api.error[LOCALE]);
				} else if (result) {
					return Helper.response(res, 400, Messages.variant.exists[LOCALE]);
				} else {
					let obj = { varient: req.body.varient, varient_ar: req.body.varient_ar, current_price : req.body.current_price }

					VarientModel.findOneAndUpdate({ _id: varient_id }, { $set: obj }, { new: true }, (updateErr, updateRes) => {
						if (updateErr) {
							return Helper.response(res, 500, Messages.api.error[LOCALE]);
						} else {
							return Helper.response(res, 200, Messages.variant.updated[LOCALE]);
						}
					})
				}
			});

		} catch (error) {
			return Helper.response(res, 500, Messages.api.fail[LOCALE]);

		}
	},

	"DeleteVarient": (req, res) => {
		let varient_id = req.params.varient_id;
		const device = VarientModel.findOne({ _id: varient_id })
		device.exec((err, result) => {
			if (err) {
				return Helper.response(res, 500, Messages.api.error[LOCALE]);
			} else if (!result) {
				return Helper.response(res, 400, "Varient Not Found");
			} else {
				VarientModel.findOneAndUpdate({ _id: varient_id }, { $set: { status: 'Delete' } }, { new: true }, (updateErr, updateRes) => {
					if (updateErr) {
						return Helper.response(res, 500, Messages.api.error[LOCALE]);
					} else {
						return Helper.response(res, 200, Messages.variant.deleted[LOCALE]);
					}
				})
			}
		})

	},

	"ChangeOrder": (req, res) => {
		let category_id = req.body.category_id;
		let brand_id = req.body.brand_id;
		let model_id = req.body.model_id;
		let varient_ids = req.body.varient_ids;
		var error = false;
		//console.log(category_ids);
		varient_ids.map(function (varient_id, index) {
			//console.log(index);
			var position = index + 1;
			let where = {
				"_id": mongoose.Types.ObjectId(varient_id),
				"category_id": mongoose.Types.ObjectId(category_id),
				"brand_id": mongoose.Types.ObjectId(brand_id),
				"model_id": mongoose.Types.ObjectId(model_id),
			}
			let obj = { $set: { position: position } };
			VarientModel.findOneAndUpdate(where, obj, function (err, result) {
				if (err) {
					error = true;
				} else {
					error = false;
				}
			})
		})
		if (error) {
			return Helper.response(res, 400, "Order Not changed");
		} else {
			return Helper.response(res, 200, "Order changed Successfully");
		}
	},
}

async function getModelQuestions(model_id, callback) {
	return new Promise((resolve, reject) => {
		let returnedData = [];
		let query = { 'model_id': model_id, "selected": true };
		let col = { _id: 1, question_id: '$_id', question: 1, options: 1, questionType: 1 };
		QuestionModel.find(query, col, function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				if (result.length > 0) {
					//for (let i = 0; i < result.length; i++) {
					//result[i].model_icon = ENV.HOST+"/model/"+result[i].model_icon;
					//returnedData.push(result[i]);
					//}
					var new_result = JSON.parse(JSON.stringify(result));
					/*new_result.map((item)=>{  
						item.options.map((row)=>{  
							if(row.selected){
								item.options.push(row);
							}
						});
					})*/
					//console.log(new_result);
					resolve(new_result);
				} else {
					resolve(returnedData);
				}
			}
		})

	}).catch(err => {
		console.log("in catch block", err);
	});
}

async function getModelVarients(model_id, callback) {
	return new Promise((resolve, reject) => {
		let returnedData = [];
		let query = { 'model_id': model_id, "status": "Active" };
		let col = { _id: 1, varient_id: '$_id', varient: 1, current_price: 1 };
		VarientModel.find(query, col, function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				if (result.length > 0) {
					//for (let i = 0; i < result.length; i++) {
					//result[i].model_icon = ENV.HOST+"/model/"+result[i].model_icon;
					//returnedData.push(result[i]);
					//}
					var new_result = JSON.parse(JSON.stringify(result));
					/*new_result.map((item)=>{  
						item.options.map((row)=>{  
							if(row.selected){
								item.options.push(row);
							}
						});
					})*/
					//console.log(new_result);
					resolve(new_result);
				} else {
					resolve(returnedData);
				}
			}
		})

	}).catch(err => {
		console.log("in catch block", err);
	});
}


module.exports = VarientApis;
