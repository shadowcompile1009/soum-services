const InfoLogModel = require('../../models/log/InfoLog');

async function Log(data, type) {
    var info = {
        data, type
    }
    return await InfoLogModel.create(info);
}

module.exports = {
    Log
}