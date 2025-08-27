const SettingModel = require('../../models/SettingModel');
const mongoose = require('mongoose');
const Helper = require('../../config/helper');
const Messages = require('../../config/messages');
const { check, validationResult } = require("express-validator");

module.exports = {
	"GetSetting": (req, res) => {
		let query = {};
		let col = {};
		SettingModel.findOne(query, col, function (err, result) {
			if (err) {
				Helper.response(res, 500, Messages.api.fail[LOCALE]);
			} else {
				if (!result) {
					/*var settingObject = {
						skip_defect_photos: false,
						product_approval: true,
						theme_color: theme_color, //"01B9FF" ,
						buyer_commission_percentage: buyer_commission_percentage, // 10,
						seller_commission_percentage: seller_commission_percentage, // 10,
						shipping_charge_percentage: shipping_charge_percentage, // 10,
						vat_percentage: vat_percentage, // 10								
						bidding_amount: bidding_amount, // 20								
					} */
					var settingObject = {
						skip_defect_photos: false,
						product_approval: true,
						theme_color: "01B9FF",
						buyer_commission_percentage: 10,
						seller_commission_percentage: 10,
						shipping_charge_percentage: 10,
						start_bid_percentage: 75,
						vat_percentage: 10,
						bidding_amount: 20
					}
					//Administrator
					let setting = new SettingModel(settingObject);
					setting.save((error, saved) => {
						if (error) {
							Helper.response(res, 500, Messages.api.fail[LOCALE]);
						} else {
							var result = { "settingData": saved };
							Helper.response(res, 200, Messages.setting.detail[LOCALE], result);
						}
					})
				} else {
					var result = { "settingData": result };
					Helper.response(res, 200, Messages.setting.detail[LOCALE], result);
				}
			}
		}).catch(function (error) {
			//console.log(error);
			Helper.response(res, 500, Messages.api.fail[LOCALE]);
		});
	},

	"UpdateSetting": (req, res) => {
		try {
			/*const {
				skip_defect_photos,
				product_approval,
				buyer_commission_percentage,
				seller_commission_percentage,
				shipping_charge_percentage,
				vat_percentage,
				bidding_amount
			} = req.body
			*/
			//console.log(req.body);
			const { referral_fixed_amount, referral_discount_type, referral_percentage, referral_credit_type, referral_credit_amount } = req.body;

			const settingData = SettingModel.findOne({ _id: req.params.settingId })
			settingData.exec((err, setting) => {
				if (err || !setting) {
					return res.status(400).json({ code: 400, message: "setting not found" })
				}
				//if (req.body.skip_defect_photos) {
				setting.skip_defect_photos = req.body.skip_defect_photos;
				//}
				//if (req.body.product_approval) {
				setting.product_approval = req.body.product_approval;
				//}
				if (req.body.theme_color) {
					setting.theme_color = req.body.theme_color;
				}
				if (req.body.buyer_commission_percentage) {
					setting.buyer_commission_percentage = req.body.buyer_commission_percentage;
				}

				if (req.body.seller_commission_percentage) {
					setting.seller_commission_percentage = req.body.seller_commission_percentage;
				} else {
					setting.seller_commission_percentage = 0;
				}

				if (req.body.shipping_charge_percentage) {
					setting.shipping_charge_percentage = req.body.shipping_charge_percentage;
				} else {
					setting.shipping_charge_percentage = 0;
				}

				if (req.body.vat_percentage) {
					setting.vat_percentage = req.body.vat_percentage;
				} else {
					setting.vat_percentage = 0;
				}
				if (req.body.bidding_amount) {
					setting.bidding_amount = req.body.bidding_amount;
				} else {
					setting.bidding_amount = 0;
				}

				if (req.body.start_bid_percentage) {
					setting.start_bid_percentage = req.body.start_bid_percentage;
				} else {
					setting.start_bid_percentage = 0;
				}

				if (referral_discount_type) setting.referral_discount_type = referral_discount_type;
				setting.referral_fixed_amount = referral_fixed_amount ? referral_fixed_amount : 0;
				setting.referral_percentage = referral_percentage ? referral_percentage : 0;
				if (referral_credit_type) setting.referral_credit_type = referral_credit_type;
				if (referral_credit_amount) setting.referral_credit_amount = referral_credit_amount;
				setting.save()
					.then(result => {
						//console.log(result);
						var rss = { "settingData": result };
						Helper.response(res, 200, Messages.setting.detail[LOCALE], rss);
						//return res.json({ code: 200, message: "Setting updated successfully", settingData: result }) 
					})
			})
		} catch (err) {
			Helper.response(res, 500, Messages.api.fail[LOCALE]);

		}

	}
}