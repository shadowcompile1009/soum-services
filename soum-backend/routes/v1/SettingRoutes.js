var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var Middleware = require('../../middleware/auth');

//Controllers
var Setting = require('../../controllers/Api/v1/SettingController');

/*routes*/
router.get('/', Setting.GetSetting);
module.exports = router;