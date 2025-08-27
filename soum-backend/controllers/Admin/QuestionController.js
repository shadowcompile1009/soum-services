const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const DeviceModel = require('../../models/DeviceModel.js');
const QuestionModel = require('../../models/QuestionModel.js');
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

const QuestionApis = {
	"AllQuestionList": async (req, res) => {
		
		const category_id = req.query.category_id;
		const limit = req.query.limit ? parseInt(req.query.limit) : 100;
		const page = req.query.page ? parseInt(req.query.page) : 1;
		let query = { 'status': 'Active' };
		
		if (typeof category_id !== "undefined") {
			query.category_id = ObjectId(category_id);
		}
		
		if (req.query.like) {
			var searchObject = {
				$or: [{ 'question': { $regex: req.query.like, $options: 'i' } },
				]
			};
			Object.assign(query, searchObject);
		}
		
		let col = { _id: 1, question_id: '$_id', question: 1, question_ar: 1, weightage: 1, category_id: 1, questionType: 1, options: 1 };
		QuestionModel.paginate(query, { select:col, limit: limit, sort: { "createdDate": 1 } }, function (err, result) {
		//QuestionModel.paginate(query, { select:col, page: page, limit: limit, sort: { "createdDate": 1 } }, function (err, result) {
		//QuestionModel.find(query, col, async function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				var new_result = JSON.parse(JSON.stringify(result));
				var questionList = new_result.docs;
	            var totalResult = new_result.total
				let returnedQuestion = [];
				if (questionList.length > 0) {
					for (let i = 0; i < questionList.length; i++) {
						//new_result[i].model_icon = ENV.HOST+"/models/"+new_result[i].model_icon;
						//new_result[i].questions = await getModelQuestions(new_result[i]._id);
						//new_result[i].varients = await getModelVarients(new_result[i]._id);
						//console.log(new_result[i].questions);
						returnedQuestion.push(questionList[i]);
					}
					//returnedModel.map((item)=>{  
					//item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
					//}) 
					//totalResult: totalResult, limit: limit, page:page
					var result = { "questionList": returnedQuestion };
					Helper.response(res, 200, "Question list fetched successfully", result);
				} else {
					var result = { "questionList": returnedQuestion };
					Helper.response(res, 400, "Failed to fetch question list", result);
				}
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},

	"AddQuestion": (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var err = { errors: errors.array() }
				Helper.response(res, 400, "Parameter missing", err);
			}
			//console.log(req.body); return false;

			let category_id = req.body.category_id;
			let question = req.body.question;
			let question_ar = req.body.question_ar;
			let questionType = req.body.questionType;
			let weightage = req.body.weightage;
			let options = req.body.options;
			if (questionType == "mcq") {
				options.map(function (item) {
					item.option_id = mongoose.Types.ObjectId()
				})
			} else {
				options = [];
			}
			//let model_icon = req.body.model_icon;
			var quesObject = {
				category_id: category_id,
				question: question,
				question_ar: question_ar,
				questionType: questionType,
				weightage: weightage,
				options: options

			};
			//console.log(modObject); return false;
			let Question = new QuestionModel(quesObject);
			Question.save((error, result) => {
				if (error) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
				else {
					Helper.response(res, 200, "Question added successfully");
				}
			});
		} catch (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}

	},

	"EditQuestion": (req, res) => {
		try {
			let question_id = req.params.question_id;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var err = { errors: errors.array() }
				Helper.response(res, 400, "Parameter missing", err);
			}
			//console.log(req.body); return false;

			let category_id = req.body.category_id;
			let question = req.body.question;
			let question_ar = req.body.question_ar;
			let questionType = req.body.questionType;
			let weightage = req.body.weightage;
			let options = req.body.options;
			if (questionType == "mcq") {
				options.map(function (item) {
					if(typeof item.option_id !== "undefined" && item.option_id != "" ){
						item.option_id = mongoose.Types.ObjectId(item.option_id)
					} else {
						item.option_id = mongoose.Types.ObjectId()
					}
				})
			} else {
				options = [];
			}
			//if (questionType != "mcq") {
			//	options = [];
			//}
			//let model_icon = req.body.model_icon;
			
			QuestionModel.findOne({ _id: mongoose.Types.ObjectId(question_id) }, (error, result) => {
				if (error) {
					return Helper.response(res, 500, "Internal server error.");
				} else {
					var quesObject = {
						category_id: category_id,
						question: question,
						question_ar: question_ar,
						questionType: questionType,
						weightage: weightage,
						options: options
		
					};
					//console.log(quesObject); return false;
					QuestionModel.findOneAndUpdate({ _id:  mongoose.Types.ObjectId(question_id) }, { $set: quesObject }, { new: true }, (updateErr, updateRes) => {
						if (updateErr) {
							return Helper.response(res, 500, "Internal server error.");
						} else {
							return Helper.response(res, 200, "Question updated successfully.");
						}
					})
				}
			});

		} catch (error) {
			return Helper.response(res, 500, "Something went wrong!");

		}
	},

	"UpdateQuestion": (req, res) => {
		try {
			let question_id = req.params.question_id;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var err = { errors: errors.array() }
				Helper.response(res, 400, "Parameter missing", err);
			}
			//console.log(req.body); return false;

			let category_id = req.body.category_id;
			let question = req.body.question;
			let question_ar = req.body.question_ar;
			let weightage = req.body.weightage;
			//let model_icon = req.body.model_icon;
			
			QuestionModel.findOne({ _id: mongoose.Types.ObjectId(question_id) }, (error, result) => {
				if (error) {
					return Helper.response(res, 500, "Internal server error.");
				} else {
					var quesObject = {
						question: question,
						question_ar: question_ar,
						weightage: weightage,
					};
					//console.log(quesObject); return false;
					QuestionModel.findOneAndUpdate({ _id:  mongoose.Types.ObjectId(question_id) }, { $set: quesObject }, { new: true }, (updateErr, updateRes) => {
						if (updateErr) {
							return Helper.response(res, 500, "Internal server error.");
						} else {
							return Helper.response(res, 200, "Question updated successfully.");
						}
					})
				}
			});

		} catch (error) {
			return Helper.response(res, 500, "Something went wrong!");

		}
	},

	"UpdateAnswer": (req, res) => {
		try {
			let question_id = req.params.question_id;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var err = { errors: errors.array() }
				Helper.response(res, 400, "Parameter missing", err);
			}
			//console.log(req.body); return false;

			let category_id = req.body.category_id;
			let option_id = req.body.option_id;
			let answer = req.body.answer;
			let answer_ar = req.body.answer_ar;
			let score = req.body.score;
			
			//if (questionType != "mcq") {
			//	options = [];
			//}
			//let model_icon = req.body.model_icon;
			
			QuestionModel.findOne({ _id: mongoose.Types.ObjectId(question_id) }, (error, result) => {
				if (error) {
					return Helper.response(res, 500, "Internal server error.");
				} else {
					var quesObject = { "options.$.answer": answer, "options.$.answer_ar": answer_ar, "options.$.score": score  };
					
					//console.log(quesObject); return false;
					QuestionModel.findOneAndUpdate({ _id:  mongoose.Types.ObjectId(question_id), "options.option_id":  mongoose.Types.ObjectId(option_id) }, { $set: quesObject }, { new: true }, (updateErr, updateRes) => {
						if (updateErr) {
							return Helper.response(res, 500, "Internal server error.");
						} else {
							return Helper.response(res, 200, "Answer updated successfully.");
						}
					})
				}
			});

		} catch (error) {
			return Helper.response(res, 500, "Something went wrong!");

		}
	},

	"DeleteQuestion": (req, res) => {
		let question_id = req.params.question_id;
		const Question = QuestionModel.findOne({ _id: mongoose.Types.ObjectId(question_id) })
		Question.exec((err, result) => {
			if (err) {
				return Helper.response(res, 500, "Internal server error.");
			} else if (!result) {
				return Helper.response(res, 400, "Question Not Found");
			} else {
				QuestionModel.remove({ _id: mongoose.Types.ObjectId(question_id) }, (updateErr, updateRes) => {
					if (updateErr) {
						return Helper.response(res, 500, "Internal server error.");
					} else {
						return Helper.response(res, 200, "Question deleted Successfully");
					}
				})
			}
		})
	},

	"DeleteAnswer": (req, res) => {
		try {
			let question_id = req.params.question_id;
			/*const errors = validationResult(req);
			if (!errors.isEmpty()) {
				var err = { errors: errors.array() }
				Helper.response(res, 400, "Parameter missing", err);
			}*/
			//console.log(req.body); return false;
			let option_id = req.params.option_id;
			
			QuestionModel.findOne({ _id: mongoose.Types.ObjectId(question_id) }, (error, result) => {
				if (error) {
					return Helper.response(res, 500, "Internal server error.");
				} else {
					//var quesObject = { "options.$.answer": answer, "options.$.answer_ar": answer_ar, "options.$.score": score  };
					var index = result.options.map(x => {
						return x.option_id.toString();
					}).indexOf(option_id.toString());

					result.options.splice(index, 1);
					var quesObject = { "options": result.options};
					//console.log(arr);
					//console.log(quesObject); return false;
					QuestionModel.findOneAndUpdate({ _id:  mongoose.Types.ObjectId(question_id)}, { $set: quesObject }, { new: true }, (updateErr, updateRes) => {
						if (updateErr) {
							return Helper.response(res, 500, "Internal server error.");
						} else {
							return Helper.response(res, 200, "Answer Deleted successfully.");
						}
					})
				}
			});
		} catch (error) {
			return Helper.response(res, 500, "Something went wrong!");

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
		let col = { _id: 1, varient_id: '$_id', varient: 1 };
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


module.exports = QuestionApis;
