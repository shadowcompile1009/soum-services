var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var Middleware = require('../../middleware/auth');

//Controllers
var UserController = require('../../controllers/Api/v1/UserController');

/*routes*/

router.get('/profile', Middleware.verifyToken, UserController.GetProfile);
router.put('/profile', Middleware.verifyToken, UserController.EditProfile);
router.put('/profile/set-lang', Middleware.verifyToken, UserController.SetLanguauge);
router.get('/address', Middleware.verifyToken, UserController.GetAddressList);
router.post('/address',
    [
        check("address", "Please Enter address").not().isEmpty(),
        check("city", "Please Enter city").not().isEmpty(),
        check("postal_code", "Please Enter postal code").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
    Middleware.verifyToken, UserController.AddAddress);
router.put('/address/:address_id',
    [
        check("address", "Please Enter address").not().isEmpty(),
        check("city", "Please Enter city").not().isEmpty(),
        check("postal_code", "Please Enter postal code").not().isEmpty(),
        //check("address_type", "Please select type").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
    Middleware.verifyToken, UserController.EditAddress);
router.delete('/address/:address_id', Middleware.verifyToken, UserController.DeleteAddress);

router.get('/cards', Middleware.verifyToken, UserController.GetCardList);
router.post('/card',
    [
        check("cardHolderName", "Please Enter name").not().isEmpty(),
        check("cardNumber", "Please Enter card number").not().isEmpty(),
        check("expiryDate", "Please enter date").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
    Middleware.verifyToken, UserController.AddCard);
router.put('/card/:cardId',
    [
        check("cardHolderName", "Please Enter name").not().isEmpty(),
        check("cardNumber", "Please Enter card number").not().isEmpty(),
        check("expiryDate", "Please enter date").not().isEmpty(),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
    Middleware.verifyToken, UserController.EditCard);
router.delete('/card/:cardId', Middleware.verifyToken, UserController.DeleteCard);

router.post('/bank-account',
    [
        check("accountHolderName", "Please Enter name").not().isEmpty(),
        check("accountId", "Please Enter account id").not().isEmpty(),
        check("bankBIC", "Please enter bank bic code").not().isEmpty(),
        check("hasVatRegisteredStore").isBoolean().not().isEmpty(),
        check("storeVatNumber").optional({checkFalsy: true}).isNumeric().isLength(15),
        //check("floor", "Please select type").not().isEmpty(),
        //check("latitude", "Please select type").not().isEmpty(),
        //check("longitude", "Please select type").not().isEmpty()
    ],
    Middleware.verifyToken, UserController.AddBankDetail);
    
router.delete('/bank-account', Middleware.verifyToken, UserController.DeleteBankDetail);

router.get('/bought-sold', Middleware.verifyToken, UserController.GetBoughtSoldProducts);
router.get('/sell-sold', Middleware.verifyToken, UserController.GetSellSoldProducts);
router.get('/my-bid-products', Middleware.verifyToken, UserController.GetMyBidProducts);
router.get('/my-sell-products', Middleware.verifyToken, UserController.GetMySellProducts);

module.exports = router;