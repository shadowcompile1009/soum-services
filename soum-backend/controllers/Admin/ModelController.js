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
const ejs = require('ejs');
const ObjectId = mongoose.Types.ObjectId;
//mongoose.Types.ObjectId

var ModUpload = Helper.upload_space("models").single('model_icon');

const ModelApis = {
	"AllModelList": async (req, res) => {
		let brand_id = req.query.brand_id
		let category_id = req.query.category_id
		let query = { 'status': 'Active' };
		if (typeof brand_id !== "undefined") {
			query.brand_id = ObjectId(brand_id);
		}
		if (typeof category_id !== "undefined") {
			query.category_id = ObjectId(category_id);
		}
		if (req.query.like) {
			var searchObject = {
				$or: [{ 'model_name': { $regex: req.query.like, $options: 'i' } },
				]
			};
			Object.assign(query, searchObject);
		}
		let limit = parseInt(req.query.limit);

		let col = { _id: 1, model_id: '$_id', model_name: 1, model_name_ar: 1, model_icon: 1, category_id: 1, brand_id: 1, questions: 1, position: 1 };
		DeviceModel.find(query, col,  {sort : {position : 1 }}, async function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				var new_result = JSON.parse(JSON.stringify(result));
				let returnedModel = [];
				if (new_result.length > 0) {
					for (let i = 0; i < new_result.length; i++) {
						//new_result[i].model_icon = ENV.HOST+"/models/"+new_result[i].model_icon;
						//new_result[i].questions = await getModelQuestions(new_result[i]._id);
						new_result[i].varients = await getModelVarients(new_result[i]._id);
						//console.log(new_result[i].questions);
						returnedModel.push(new_result[i]);
					}
					//returnedModel.map((item)=>{  
					//item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
					//}) 
					//console.log(returnedModel);
					var result = { "modelList": returnedModel };
					Helper.response(res, 200, Messages.model.list[LOCALE], result);
				} else {
					var result = { "modelList": returnedModel };
					Helper.response(res, 400, Messages.model.list[LOCALE], result);
				}
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},

	"AddModel": (req, res) => {
		try {

			ModUpload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					//console.log(req.body); return false;
					var where = {
						'model_name': new RegExp("^" + req.body.model_name + "$", "i"), 'status': { $ne: 'Delete' },
						'category_id': req.body.category_id,
						'brand_id' : req.body.brand_id
					};
					DeviceModel.findOne(where, function (err, modelExist) {
						//console.log(listExist);
						if (!modelExist) {
							let category_id = req.body.category_id;
							let brand_id = req.body.brand_id;
							let model_name = req.body.model_name;
							let model_name_ar = req.body.model_name_ar;

							let cdnUrl = "";
							if (req.file && req.file.location) {
							  const fileUrl = new URL(req.file.location);
							  cdnUrl = ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
							}

							var modObject = {
								category_id: category_id,
								brand_id: brand_id,
								model_name: model_name,
								model_name_ar: model_name_ar,
								model_icon: cdnUrl,
								// current_price: req.body.current_price

							};
							//console.log(modObject); return false;
							let Model = new DeviceModel(modObject);
							Model.save((error, result) => {
								if (error) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
								else {
									Helper.response(res, 200, Messages.model.added[LOCALE]);
								}
							});
						} else {
							Helper.response(res, 400, Messages.model.exists[LOCALE]);
						}
					});
				}
			});
		} catch (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}

	},

	"EditModel": (req, res) => {
		try {
			ModUpload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					let model_id = req.params.model_id;
					DeviceModel.findOne({ model_name: new RegExp("^" + req.body.model_name + "$", "i"), 'status': { $ne: 'Delete' }, _id: { $ne: model_id }, 'category_id': req.body.category_id,
					'brand_id' : req.body.brand_id }, (error, result) => {
						if (error) {
							return Helper.response(res, 500, "Internal server error.");
						} else if (result) {
							return Helper.response(res, 400, "already exist.");
						} else {
							//  current_price: req.body.current_price
							let obj = { model_name: req.body.model_name, model_name_ar: req.body.model_name_ar }
							if (typeof req.file !== "undefined") {
								const fileUrl = new URL(req.file.location);
								const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
								obj.model_icon = cdnUrl;
							}
							DeviceModel.findOneAndUpdate({ _id: model_id }, { $set: obj }, { new: true }, (updateErr, updateRes) => {
								if (updateErr) {
									return Helper.response(res, 500, "Internal server error.");
								} else {
									return Helper.response(res, 200, "Model updated successfully.");
								}
							})
						}
					});
				}
			})
		} catch (error) {
			return Helper.response(res, 500, "Something went wrong!");

		}
	},

	"DeleteModel": (req, res) => {
		let model_id = req.params.model_id;
		const device = DeviceModel.findOne({ _id: model_id })
		device.exec((err, result) => {
			if (err) {
				return Helper.response(res, 500, "Internal server error.");
			} else if (!result) {
				return Helper.response(res, 400, "Model Not Found");
			} else {
				DeviceModel.findOneAndUpdate({ _id: model_id }, { $set: { status: 'Delete' } }, { new: true }, (updateErr, updateRes) => {
					if (updateErr) {
						return Helper.response(res, 500, "Internal server error.");
					} else {
						return Helper.response(res, 200, "Model deleted Successfully");
					}
				})
			}
		})

	},
	
	"ChangeOrder": (req, res) => {
		let category_id = req.body.category_id;
		let brand_id = req.body.brand_id;
		let model_ids = req.body.model_ids;
		var error = false;
		//console.log(category_ids);
		model_ids.map(function (model_id, index) {
			//console.log(index);
			var position = index + 1;
			let where = { "_id": mongoose.Types.ObjectId(model_id), "category_id": mongoose.Types.ObjectId(category_id), "brand_id" : mongoose.Types.ObjectId(brand_id) }
			let obj = { $set : { position: position } } ;
			DeviceModel.findOneAndUpdate(where, obj, function (err, result) {
				if (err) {
					error = true;
				} else {
					error = false;
				}
			})
		})
		if (error) {
			return Helper.response( res, 400, "Order Not changed");
		} else {
			return Helper.response( res, 200, "Order changed Successfully");
		}
	},

	"AssignQuestionToModel": (req, res) => {
		let model_id = req.params.model_id;
		let jsonBody = req.body.questions;
		const device = DeviceModel.findOne({ _id: model_id })
		device.exec((err, result) => {
			if (err) {
				return Helper.response(res, 500, "Internal server error.");
			} else if (!result) {
				return Helper.response(res, 400, "Model Not Found");
			} else {
				DeviceModel.findOneAndUpdate({ _id: model_id }, { $set: { questions: jsonBody } }, { new: true }, (updateErr, updateRes) => {
					if (updateErr) {
						return Helper.response(res, 500, "Internal server error.");
					} else {
						return Helper.response(res, 200, "Questions assigned Successfully");
					}
				})
			}
		})

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
		let col = { _id: 1, varient_id: '$_id', varient: 1 };
		VarientModel.find(query, col, {sort : {position : 1 }}, function (err, result) {
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


module.exports = ModelApis;
