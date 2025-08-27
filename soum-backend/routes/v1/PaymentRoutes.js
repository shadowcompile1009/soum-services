var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var paymentController = require('../../controllers/Api/v1/PaymentController');

/*routes*/
router.post('/', Middleware.without_login, paymentController.handlePayment);
module.exports = router;