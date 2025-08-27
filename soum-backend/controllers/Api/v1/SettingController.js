const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const SettingModel = require("../../../models/SettingModel.js");
const Helper = require("../../../config/helper.js");
const Messages = require("../../../config/messages.js");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const express = require("express");
//const app = express();
//app.use(express.static(path.join(__dirname, 'emailTemplates')));
const nunjucks = require("nunjucks");
const multer = require("multer");
const ejs = require("ejs");
const ObjectId = mongoose.Types.ObjectId;
const axios = require("axios");
const axiosRetry = require("axios-retry");
const errorLogDAL = require("../../../Data/log/ErrorLogDAL");
const settingDAL = require("../../../Data/SettingDAL");


//mongoose.Types.ObjectId

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./assets/category");
  },
  filename: function (req, file, callback) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    var fileExt = path.extname(file.originalname);
    var fileName = file.originalname;
    fileName = fileName.split(".");
    fileName = fileName[0];
    //fileName.splice(-1, 1);
    //fileName.join('');
    fileName = fileName.replace(" ", "-");
    fileName = fileName + "-" + new Date().getTime();
    var data = fileName + fileExt;
    //console.log("in data--->>>", data);
    callback(null, data);
  },
});

var Upload = multer({ storage: storage }).single("category_icon");

const settingApis = {
  GetSetting: async (req, res) => {
    try {
      const result = await settingDAL.GetSetting()
      if (result) {
        Helper.response(res, 200, Messages.setting.detail[LOCALE], {
          settingData: result,
        });
      } else {
        Helper.response(res, 400, Messages.api.fail[LOCALE]);
      }
    } catch (error) {
      console.log(error);
      Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },
};

module.exports = settingApis;
