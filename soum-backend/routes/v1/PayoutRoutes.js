var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var PayoutController = require('../../controllers/Api/v1/PayoutController');

/*routes*/
router.post('/notification', PayoutController.HyperSplitPayoutNotification);
module.exports = router;