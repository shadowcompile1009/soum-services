const ConditionDAL = require('../../Data/ConditionDAL');
const ConditionsService = require('../../services/ConditionsService');
const Helper = require('../../config/helper');
const Messages = require('../../config/messages.js');

async function GetConditionById(req, res) {
    try {
      const id = req.params.id;
      let conditionsService = new ConditionsService(ConditionDAL);
      const condition = await conditionsService.GetConditionById(id);
      if(condition) {
        return Helper.response(res, 200, "condition", { condition: condition });
      } else {
        return Helper.response(res, 200, "condition", { condition: [] });
      }
    } catch (error) {
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  }

async function AddNewCondition(req, res) {
    try {
        const id = req.body.varient_id;
        let conditionsService = new ConditionsService(ConditionDAL);
        const condition = await conditionsService.AddNewCondition(id);
        return Helper.response(res, 200, "condition Added Successfully", { condition: condition });
    } catch (err) {
        return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
}

async function UpdateCondition(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        let conditionsService = new ConditionsService(ConditionDAL);
        const condition = await conditionsService.UpdateCondition(id, data);
        return Helper.response(res, 200, "condition Updated Successfully", { condition: condition });
    } catch(err) {
        return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
}

module.exports = {
    GetConditionById,
    AddNewCondition,
    UpdateCondition
}