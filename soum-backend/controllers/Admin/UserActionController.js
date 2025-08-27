const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const BrandModel = require('../../models/BrandModel.js');
const Helper = require('../../config/helper.js');
const Messages = require('../../config/messages.js');
const authAdmin = require('../../middleware/authAdmin');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const express = require('express');
const nunjucks = require('nunjucks');
const multer = require('multer');
const ejs = require('ejs');
const { brand } = require('../../config/messages.js');
const router = require('./CategoryController.js');
const ObjectId = mongoose.Types.ObjectId;
const UserActionModel = require('../../Data/UserActionDAL')

async function GetAllAction(req, res) {
    try {
        let allActions = await UserActionModel.GetAllAction();
        return Helper.response(res, 200, Messages.UserAction.list[LOCALE], { UserActionData: allActions });
    } catch (error) {
        return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
}

module.exports = {
    GetAllAction,
}