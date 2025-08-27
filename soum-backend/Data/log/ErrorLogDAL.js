const ErrorLogModel = require('../../models/log/ErrorLog');

async function Log(data, controller, method_name, status_code, params) {
    var error = {
        data, controller, method_name, status_code, params
    }
    return await ErrorLogModel.create(error);
}

module.exports = {
    Log
}