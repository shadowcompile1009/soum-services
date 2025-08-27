var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var Middleware = require('../../middleware/auth');

//Controllers
var OrderController = require('../../controllers/Api/v1/OrderController');

/*routes*/

router.post('/transaction/save', 
    [
        check("order_id", "Please Enter location").not().isEmpty(),
        check("product_id", "Please Enter full address").not().isEmpty(),
        //check("transaction_detail", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.without_login, OrderController.TransactionSave);

router.post('/transaction/cancel', 
    [
        check("order_id", "Please Enter location").not().isEmpty(),
        check("product_id", "Please Enter full address").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.verifyToken, OrderController.TransactionCancel);

/*router.post('/ship-detail', 
    [
        check("order_id", "Please Enter location").not().isEmpty(),
        //check("product_id", "Please Enter full address").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.verifyToken, OrderController.ShippingDetail);*/
router.get('/pay-out', Middleware.verifyToken, OrderController.GetFinishedOrders)
router.get('/ship-detail/:order_id', Middleware.verifyToken, OrderController.ShippingDetail);
router.get('/detail/:order_id', Middleware.verifyToken, OrderController.Detail);
router.post('/cancel',
[
    check('order_id').not().isEmpty().withMessage('Value must be required'),
    check('return_reason').not().isEmpty().withMessage('Value must be required'),
], 
 Middleware.verifyToken, 
 OrderController.Cancel);

 router.post('/bid-transaction/save', 
    [
        check("bid_id", "Please Enter location").not().isEmpty(),
        check("product_id", "Please Enter full address").not().isEmpty(),
        //check("transaction_detail", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.verifyToken, OrderController.BidTransactionSave);

router.post('/bid-transaction/cancel', 
    [
        check("bid_id", "Please Enter bid id").not().isEmpty(),
        check("product_id", "Please Enter product id").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.verifyToken, OrderController.BidTransactionCancel);

router.post('/track', 
    [
        check("shipment_identification_number", "Please Enter tracking number").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.verifyToken, OrderController.TrackOrder);

router.post('/delivered', 
    [
        check("order_id", "Please Enter order_id").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
Middleware.verifyToken, OrderController.Delivered);

router.get('/user-notify', Middleware.verifyToken, OrderController.MarkAllAsNotified);

 
module.exports = router;