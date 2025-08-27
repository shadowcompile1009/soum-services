const DeviceModel = require('../models/DeviceModel');
const mongoose = require('mongoose');

async function GetById(id) {
    return await DeviceModel.findOne({ _id: mongoose.Types.ObjectId(id) }, { lean: false });
}

module.exports = {
    GetById
}