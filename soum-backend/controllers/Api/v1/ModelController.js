const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const DeviceModel = require('../../../models/DeviceModel.js');
const QuestionModel = require('../../../models/QuestionModel.js');
const VarientModel = require('../../../models/VarientModel.js');
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
const { update } = require('../../../models/DeviceModel.js');
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
const ModelApis = {
	"AllModelList": async (req, res) => {
		let brand_id = req.params.brand_id
		let category_id = req.params.category_id
		if (!brand_id || !category_id || !mongoose.Types.ObjectId.isValid(brand_id) || !mongoose.Types.ObjectId.isValid(category_id)) {
			return Helper.response(res, 400, Messages.api.param_missing[LOCALE]);
		}
		let query = { 'status': 'Active', 'brand_id': ObjectId(brand_id), 'category_id': ObjectId(category_id) };

		if (req.query.like) {
			var searchObject = {
				$or: [{ 'model_name': { $regex: req.query.like, $options: 'i' } },
				]
			};
			Object.assign(query, searchObject);
		}
		let limit = parseInt(req.query.limit);

		let col = { _id: 1, model_id: '$_id', model_name: 1, model_name_ar: 1, model_icon: 1, category_id: 1, brand_id: 1, varient: 1, current_price: 1, position: 1 };
		DeviceModel.find(query, col, { sort: { position: 1 } }, async function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				var new_result = JSON.parse(JSON.stringify(result));
				let returnedModel = [];
				if (new_result.length > 0) {
					//for (let i = 0; i < new_result.length; i++) {
					await Promise.all(new_result.map(async function (item) {
						//var item = new_result[i];
						//new_result[i].model_icon = ENV.HOST+"/models/"+new_result[i].model_icon;
						//item.questions = await getModelQuestions(item._id);
						if (LOCALE == "ar") {
							item.model_name = item.model_name_ar;
						}
						item.varients = [];
						//item.questions = await getModelQuestionList(item._id);
						item.questions = [];
						returnedModel.push(item);
					}));
					//console.log(JSON.stringify(returnedModel));
					//}
					//returnedModel.map((item)=>{  
					//item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
					//}) 
					var result = { "modelList": returnedModel.sort((a, b) => a.position - b.position) };
					Helper.response(res, 200, Messages.model.list[LOCALE], result);
				} else {
					var result = { "modelList": returnedModel.sort((a, b) => a.position - b.position) };
					Helper.response(res, 200, Messages.model.list[LOCALE], result);
				}
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},
	"AddModel": (req, res) => {
		try {

			Upload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					//console.log(req.body); return false;
					var where = { 'model_name': new RegExp("^" + req.body.model_name + "$", "i") };
					DeviceModel.findOne(where, function (err, modelExist) {
						//console.log(listExist);
						if (!modelExist) {
							let category_id = req.body.category_id;
							let brand_id = req.body.brand_id;
							let model_name = req.body.model_name;

							//let model_icon = req.body.model_icon;
							var modObject = {
								category_id: category_id,
								brand_id: brand_id,
								model_name: model_name,
								model_icon: req.file.filename,
								varient: req.body.varient

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
}


async function getAllQuestionList(category_id, callback) {
	return new Promise((resolve, reject) => {
		var questionData = [];
		QuestionModel.find({ category_id: mongoose.Types.ObjectId(category_id) }).lean().exec(function (qerr, qresult) {
			if (qresult.length > 0) {
				qresult.map(function (item) {
					delete item.status;
					delete item.created_at;
					delete item.updated_at;
					questionData.push(item);
				})
			}
			//console.log(questionData)
			resolve(questionData);
		});
	}).catch(err => {
		console.log("in catch block", err);
	});
}

async function getModelQuestionList(model_id, callback) {
	return new Promise((resolve, reject) => {
		var returnedData = [];
		var questionData = [];
		var questionIds = [];
		DeviceModel.findOne({ '_id': model_id })
			.lean()
			.then(function (result) {
				if (!result) { throw new Error('User not found'); }
				else {
					var results = JSON.parse(JSON.stringify(result));
					//console.log(results.questions); 

					if (typeof results.questions !== "undefined" && results.questions.length > 0) {
						var questions = results.questions;
						for (let i = 0; i < questions.length; i++) {
							questionIds.push(questions[i].question_id);
							questionData.push(questions[i]);
						}
						QuestionModel.find({ _id: { "$in": questionIds } }).lean().exec(function (qerr, qresult) {
							questionData.map(function (val) {
								qresult.map(function (item) {
									if (item._id.toString() == val.question_id.toString()) {
										val.question = item.question;
										val.question_ar = item.question_ar;
										val.weightage = item.weightage;
										val.questionType = item.questionType;
										var op = [];
										item.options.map(function (ind) {
											let check = val.options.includes(ind.option_id.toString());
											if (check) {
												op.push(ind);
											}
										})
										val.options = op;
									}
								})
							})
							//console.log(questionData)
							resolve(questionData);
						});
					} else {
						resolve(returnedData);
					}
				}
			})
	}).catch(err => {
		console.log("in catch block", err);
	});
}

async function getModelQuestions(model_id, callback) {
	return new Promise((resolve, reject) => {
		let returnedData = [];
		let query = { 'model_id': model_id, "selected": true };
		let col = { _id: 1, question_id: '$_id', question: 1, question_ar: 1, options: 1, questionType: 1 };
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
		let col = { _id: 1, varient_id: '$_id', varient: 1, varient_ar: 1, current_price: 1 };
		VarientModel.find(query, col, { sort: { position: 1 } }, function (err, result) {
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
