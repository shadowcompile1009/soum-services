const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserActionModel = require('../models/UserActionModel');

async function GetActionById(Id) {
    return await UserActionModel.findById({ _id: mongoose.Types.ObjectId(userId) });
}

async function GetAllAction() {
    return await UserActionModel.find().lean();
}

async function CreateNewAction(UserActionData) {
    return await UserActionModel.create(UserActionData);
}

async function PrepareActionObj(actionId, userId, actionType, referenceId, status) {
    var checkoutAction =  {
        userId,
        actionType,
        referenceId,
        actionId ,
        status,
    };
    return await CreateNewAction(checkoutAction)
}
module.exports = {
    CreateNewAction,
    GetActionById,
    GetAllAction,
    PrepareActionObj
}
