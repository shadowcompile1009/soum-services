const { commonResponse: response } = require('../../helper');
const { ErrorMessage } = require('../helper/message');
const { ErrorCode } = require('../../helper');


/**
 * loginValidation validation
 **/
exports.loginValidation = function (req, res, next) {
    if(!req.body.email  ||  !req.body.password){
        return Helper.response(res, 500, "FIELD_REQUIRED");
    }else{
        next()
    }
}