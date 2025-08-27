const ConditionModel = require('../models/ConditionModel');
const mongoose = require('mongoose');

async function GetConditionById(id) {
    return await ConditionModel.find({ varient_id: mongoose.Types.ObjectId(id) });
}


async function AddNewCondition(id) {
    return await ConditionModel.create(
        {
            like_new: '',
            like_new_ar: '',
            light_use: '',
            light_use_ar: '',
            good_condition: '',
            good_condition_ar: '',
            extensive_use: '',
            extensive_use_ar: '',
            varient_id: mongoose.Types.ObjectId(id)
        }
    )
}


async function UpdateCondition(id, data) {
    return await ConditionModel.findOneAndUpdate({ varient_id: mongoose.Types.ObjectId(id) }, { $set: data })
}

module.exports = {
    GetConditionById,
    AddNewCondition,
    UpdateCondition
}