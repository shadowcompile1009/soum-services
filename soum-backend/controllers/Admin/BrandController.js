const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const BrandModel = require('../../models/BrandModel.js');
const Helper = require('../../config/helper.js');
const Messages = require('../../config/messages.js');
const authAdmin = require('../../middleware/authAdmin');
const _ = require('lodash');
const path = require('path');
const ejs = require('ejs');
const { brand } = require('../../config/messages.js');
const router = require('./CategoryController.js');
const ObjectId = mongoose.Types.ObjectId;
//mongoose.Types.ObjectId

var BrandUpload = Helper.upload_space("brands").single('brand_icon');

module.exports = {
	"AllBrandList": (req, res) => {
		let category_id = req.query.category_id
		let query = { 'status': 'Active' };
		if(typeof category_id !== "undefined"){
			query.category_id = ObjectId(category_id);
		}
		if (req.query.like) {
			var searchObject = {
				$or: [{ 'brand_name': { $regex: req.query.like, $options: 'i' } },
				]
			};
			Object.assign(query, searchObject);
		}
		let limit = parseInt(req.query.limit);

		let col = { _id: 1, brand_name: 1, brand_name_ar: 1, brand_icon: 1, category_id: 1, position : 1, add_ons: 1, is_add_on_enabled: 1 };
		BrandModel.find(query, col, {sort : {position : 1 }}, function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				//console.log(result);
				let returnedBrand = [];
				if (result.length > 0) {
					for (let i = 0; i < result.length; i++) {
						//result[i].brand_icon = ENV.HOST + "/brand/" + result[i].brand_icon;
						returnedBrand.push(result[i].transform());
					}
					//returnedBrand.map((item)=>{  
					//item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
					//}) 
					var result = { "brandList": returnedBrand };
					Helper.response(res, 200, Messages.brand.list[LOCALE], result);
				} else {
					var result = { "brandList": [] };
					Helper.response(res, 200, Messages.brand.list[LOCALE], result);
				}
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},
	"AddBrand": (req, res) => {
		try {
			BrandUpload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					//console.log(req.body); return false;
					var where = { 'brand_name': new RegExp("^" + req.body.brand_name + "$", "i"), 'status' : {$ne:"Delete"}, "category_id": { $eq: req.body.category_id } };
					BrandModel.findOne(where, function (err, brandExist) {
						//console.log(listExist);
						if (!brandExist) {
							let category_id = req.body.category_id;
							let brand_name = req.body.brand_name;
							let brand_name_ar = req.body.brand_name_ar;
							const fileUrl = new URL(req.file.location);
							const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
							var catObject = {
								category_id: category_id,
								brand_name: brand_name,
								brand_name_ar: brand_name_ar,
								brand_icon: cdnUrl
							};
							let Brand = new BrandModel(catObject);
							Brand.save((error, result) => {
								if (error) { console.log(error); Helper.response(res, 500, Messages.api.fail[LOCALE]); }
								else {
									Helper.response(res, 200, Messages.brand.added[LOCALE]);
								}
							});
						} else {
							Helper.response(res, 400, Messages.brand.exists[LOCALE]);
						}

					});
				}
			});
		} catch (error) {
			console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}

	},

	"EditBrand": (req, res) => {
		try {
			
			BrandUpload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					let brand_id = req.params.brand_id;
					BrandModel.findOne({ brand_name: new RegExp("^" + req.body.brand_name + "$", "i"), 'status': { $ne: 'Delete' }, _id: { $ne: brand_id }, "category_id": { $eq: req.body.category_id } }, (error, result) => {
						if (error) {
							return Helper.response(res, 500, "Internal server error.");
						} else if (result) {
							return Helper.response(res, 400, "already exist.");
						} else {
							let obj = { brand_name: req.body.brand_name, brand_name_ar : req.body.brand_name_ar  }
							if (typeof req.file !== "undefined") {
								const fileUrl = new URL(req.file.location);
								const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
								obj.brand_icon = cdnUrl;
							}
							BrandModel.findOneAndUpdate({ _id: brand_id }, { $set: obj }, { new: true }, (updateErr, updateRes) => {
								if (updateErr) {
									return Helper.response(res, 500, "Internal server error.");
								} else {
									return Helper.response(res, 200, "Brand updated successfully.");
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

	"DeleteBrand": (req, res) => {
		let brand_id = req.params.brand_id;
		const brand = BrandModel.findOne({ _id: brand_id })
		brand.exec((err, result) => {
			if (err) {
				return Helper.response(res, 500, "Internal server error.");
			} else if (!result) {
				return Helper.response(res, 400, "Brand Not Found");
			} else {
				BrandModel.findOneAndUpdate({ _id: brand_id }, { $set: {status : 'Delete'} }, { new: true }, (updateErr, updateRes) => {
					if(updateErr){
						return Helper.response(res, 500, "Internal server error.");
					} else {
						return Helper.response(res, 200, "Brand deleted Successfully");
					}
				})
			}	
		})

	},

	"ChangeOrder": (req, res) => {
		let category_id = req.body.category_id;
		let brand_ids = req.body.brand_ids;
		var error = false;
		//console.log(category_ids);
		brand_ids.map(function (brand_id, index) {
			//console.log(index);
			var position = index + 1;
			let where = { "_id": mongoose.Types.ObjectId(brand_id), "category_id": mongoose.Types.ObjectId(category_id) }
			let obj = { $set : { position: position } } ;
			BrandModel.findOneAndUpdate(where, obj, function (err, result) {
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
