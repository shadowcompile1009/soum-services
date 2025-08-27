var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');
var AdminMiddleware = require('../../middleware/authAdmin');

//Controllers
var Bank = require('../../controllers/Api/v1/BankController');

/*routes*/
router.get('/', Middleware.verifyToken, Bank.AllBankList);
router.post('/', AdminMiddleware.verifyToken, Bank.AddBank);
module.exports = router;