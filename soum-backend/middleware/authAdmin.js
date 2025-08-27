const auth = require('basic-auth')
//const { config } = require('../config/config')
//const { ErrorMessage } = require('../helper/message')
const Helper  = require('../config/helper')
const AdminModel = require('../models/AdminModel')
const jwt = require('jsonwebtoken')
//const { console } = require('../config/helper')

exports.verifyToken = (req, res, next) => {
    if (req.headers.token) {
        jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY_ADMIN, (err, result) => {
            //console.log("i am in token",result)
            if (err) {
                //console.log("1",err)
                return Helper.response(res, 401, "Invalid token");
            }
            else {
                next();
            }
        })
    } else {
        return Helper.response(res, 401, "Token not found");
    }
}