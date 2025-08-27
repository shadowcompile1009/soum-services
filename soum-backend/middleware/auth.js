const auth = require('basic-auth')
const { config } = require('../config/helper')
const Helper = require('../config/helper')
const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const { UserStatus } = require('../constants/user');


exports.verifyToken = (req, res, next) => {
    //console.log(req.headers);
    var lang = req.headers.lang ? req.headers.lang : 'en';
    app.set("locale", lang);
    global.LOCALE = app.get('locale');
    const publicKey =  process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
    if (req.headers.token) {
        jwt.verify(req.headers.token, publicKey, { ignoreExpiration: true }, (err, result) => {
            //console.log("i am in token",result)
            if (err) {
                //return Helper.response(res, 500, "Internal server error");
                return Helper.response(res, 401, "Invalid token");
            }
            else {
                UserModel.findOne({ _id: result.id }, (error, user) => {
                    if (user && (user.status === UserStatus.DELETED || user.status === UserStatus.INACTIVE)) {
                      return Helper.response(res, 401, 'Invalid token');
                    }

                    if (error) {
                        return Helper.response(res, 500, "Internal server error");
                    } else if (!user) {
                        return Helper.response(res, 401, "Invalid token");
                    } else {
                      req.user = user;
                      next();
                    }
                })
            }
        })
    } else {
        return Helper.response(res, 401, "Token not found");
        // req.user = [];
        // req.user._id = "";
        // next();
    }

}

exports.without_login = (req, res, next) => {
  var lang = req.headers.lang ? req.headers.lang : "en";
  app.set("locale", lang);
  global.LOCALE = app.get("locale");
  if (req.headers.token) {
    const publicKey =  process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
    return jwt.verify(
      req.headers.token,
      publicKey,
      {
        ignoreExpiration: true
      },
      (err, result) => {
        if (!err) {
          UserModel.findOne({ _id: result.id }, (error, result2) => {
            if (result2) {
              req.user = result2;
            }
            next();
          });
        } else next();
      }
    );
  } else next();
};