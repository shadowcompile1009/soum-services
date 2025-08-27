const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const CategoryModel = require('../../models/CategoryModel');
const Helper = require('../../config/helper.js');
const Messages = require('../../config/messages.js');
const authAdmin = require('../../middleware/authAdmin');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
//const app = express();
//app.use(express.static(path.join(__dirname, 'emailTemplates')));
const ejs = require('ejs');
const ObjectId = mongoose.Types.ObjectId;
//mongoose.Types.ObjectId

var CatUpload = Helper.upload_space("category").single('category_icon');

module.exports = {
	"AllCategoryList": (req, res) => {
		let query = { 'status': 'Active' };
		if (req.query.like) {
			var searchObject = {
				$or: [{ 'category_name': { $regex: req.query.like, $options: 'i' } },
				]
			};
			Object.assign(query, searchObject);
		}
		let limit = parseInt(req.query.limit);

		let col = { _id: 1, category_name: 1, category_name_ar: 1, category_icon: 1, position: 1 };
		CategoryModel.find(query, col, {sort : {position : 1 }}, function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				let returnedCategory = [];
				for (let i = 0; i < result.length; i++) {
					//result[i].category_icon = ENV.HOST + "/category/" + result[i].category_icon;
					returnedCategory.push(result[i].transform());
				}
				//returnedCategory.map((item)=>{  
				//item.category_icon = process.env.HOST+"/category/"+item.category_icon;
				//}) 
				var result = { "categoryList": returnedCategory };
				Helper.response(res, 200, Messages.category.list[LOCALE], result);
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},

	"AddCategory": (req, res) => {
		try {
			CatUpload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					//console.log(req.body); return false;
					var where = { 'category_name': new RegExp("^" + req.body.category_name + "$", "i"), 'status': { $ne: 'Delete' } };
					CategoryModel.findOne(where, function (err, catExist) {
						//console.log(listExist);
						if (!catExist) {
							let category_name = req.body.category_name;
							let category_name_ar = req.body.category_name_ar ? req.body.category_name_ar : "";
							const fileUrl = new URL(req.file.location);
							const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
							var catObject = {
								category_name: category_name,
								category_name_ar: category_name_ar,
								category_icon: cdnUrl
							};
							let Category = new CategoryModel(catObject);
							Category.save((error, result) => {
								if (error) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
								else {
									Helper.response(res, 200, Messages.category.added[LOCALE]);
								}
							});
						} else {
							Helper.response(res, 400, Messages.category.exists[LOCALE]);
						}

					});
				}
			});
		} catch (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}

	},

	"EditCategory": (req, res) => {
		try {
			CatUpload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					let category_id = req.params.category_id;
					CategoryModel.findOne({ category_name: new RegExp("^" + req.body.category_name + "$", "i"), 'status': { $ne: 'Delete' }, _id: { $ne: category_id } }, (error, result) => {
						if (error) {
							return Helper.response(res, 500, "Internal server error.");
						} else if (result) {
							return Helper.response(res, 400, " already exist.");
						} else {
							let obj = { category_name: req.body.category_name, category_name_ar: req.body.category_name_ar }
							if (typeof req.file !== "undefined") {
								const fileUrl = new URL(req.file.location);
								const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
								obj.category_icon = cdnUrl;
							}
							CategoryModel.findOneAndUpdate({ _id: category_id }, { $set: obj }, { new: true }, (updateErr, updateRes) => {
								if (updateErr) {
									return Helper.response(res, 500, "Internal server error.");
								} else {
									return Helper.response(res, 200, "Category updated successfully.");
								}
							})
						}
					});
				}
			});

		} catch (error) {
			return Helper.response(res, 500, "Something went wrong!");

		}
	},

	"DeleteCategory": (req, res) => {
		try {
			let category_id = req.params.category_id;
			const category = CategoryModel.findOne({ _id: category_id })
			category.exec((err, result) => {
				if (err) {
					return Helper.response(res, 500, "Internal server error.");
				} else if (!result) {
					return Helper.response(res, 400, "Category Not Found");
				} else {
					CategoryModel.findOneAndUpdate({ _id: category_id }, { $set: { status: 'Delete' } }, { new: true }, (updateErr, updateRes) => {
						if (updateErr) {
							return Helper.response(res, 500, "Internal server error.");
						} else {
							return Helper.response(res, 200, "Category deleted Successfully");
						}
					})
				}
			})
		} catch (err) {
			return Helper.response(res, 500, "Something went wrong!");
		}
	},

	"ChangeOrder": (req, res) => {
		let category_ids = req.body.category_ids;
		var error = false;
		//console.log(category_ids);
		category_ids.map(function (category_id, index) {
			//console.log(index);
			var position = index + 1;
			let where = { "_id": mongoose.Types.ObjectId(category_id) }
			let obj = { $set : { position: position } } ;
			CategoryModel.findOneAndUpdate(where, obj, function (err, result) {
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

}

//module.exports = router;
