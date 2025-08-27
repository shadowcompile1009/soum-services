const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const BrandModel = require('../../../models/BrandModel.js');
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
        callback(null, './assets/brand');
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

var Upload = multer({ storage: storage }).single('brand_icon');

const BrandApis = {
	"AllBrandList" : (req, res) => {
		const category_id = req.params.category_id
		if(!category_id || !mongoose.isValidObjectId(category_id)) {
			return Helper.response(res, 400, Messages.api.param_missing[LOCALE]);
		}
		let query = {'status': 'Active', 'category_id' : ObjectId(category_id)};
		
		if (req.query.like) {
			var searchObject = { 
				$or: [{ 'brand_name': { $regex: req.query.like, $options: 'i' } }, 
				] 
			};
			Object.assign(query, searchObject);
		}
		let limit = parseInt(req.query.limit);

		let col = { _id:1, brand_name: 1, brand_name_ar: 1, brand_icon: 1, category_id: 1 };
		BrandModel.find(query, col, {sort : {position : 1 }}, function (err, result) {
			if (err) { 
				Helper.response(res, 500, Messages.api.error[LOCALE]);
			} else {
				//console.log(result);
				let returnedBrand = [];
				if(result.length > 0){
					for (let i = 0; i < result.length; i++) {
						//result[i].brand_icon = ENV.HOST+"/brand/"+result[i].brand_icon;
						if (LOCALE == "ar") {
                            result[i].brand_name = result[i].brand_name_ar;
                        }
						returnedBrand.push(result[i].transform());
					}
					//returnedBrand.map((item)=>{  
						//item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
					//}) 
					var result = {"brandList" : returnedBrand};
					Helper.response(res, 200, Messages.brand.list[LOCALE], result);
				} else {
					var result = {"brandList" : []};
					Helper.response(res, 200, Messages.brand.list[LOCALE], result);
				}
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		}); 
	},
	"AddBrand" : (req, res) => {
		try {
			Upload(req, res, function (err, result) {
				if (err) {
					console.log("rrr", err)
					return Helper.response(res, 500, Messages.api.fail[LOCALE]);
				} else {
					//console.log(req.body); return false;
					var where = { 'brand_name': new RegExp("^" + req.body.brand_name + "$", "i") };
					BrandModel.findOne(where, function (err, brandExist) {
						//console.log(listExist);
						if(!brandExist){
							let category_id = req.body.category_id;
							let brand_name = req.body.brand_name;
							//let brand_icon = req.body.brand_icon;
							var catObject = {
								category_id: category_id,
								brand_name: brand_name,
								brand_icon: req.file.filename
							};
							let Brand = new BrandModel(catObject);
							Brand.save((error, result) => {
							if (error) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
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
		} catch(error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		} 
		
	},
	
}

module.exports = BrandApis;
