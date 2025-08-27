const VarientModel = require('../../../models/VarientModel');
const Helper = require('../../../config/helper.js');
const Messages = require('../../../config/messages.js');
const _ = require('lodash');

const VarientApis = {
	"AllVarientListByModelId": async (req, res) => {
		let model_id = req.params.modelId;
		let query = { 'model_id': model_id, 'status': 'Active' };

		let col = { varient: 1, model_id: 1, current_price: 1 };
		VarientModel.find(query, col, async function (err, result) {
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
	}
}

module.exports = VarientApis;