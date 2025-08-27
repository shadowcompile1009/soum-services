var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var Middleware = require('../../middleware/auth');
const Helper = require('../../config/helper.js');

//Controllers
var Product = require('../../controllers/Api/v1/ProductController');

/*routes*/
router.post('/', [
    Middleware.verifyToken,
    Helper.upload_space("products").fields([{ name: "product_images", maxCount: 10 }, { name: "defected_images", maxCount: 10 }])
], Product.AddProduct);
router.post('/list/:category_id', Middleware.without_login, Product.AllProductList);
router.post('/get-products-by-model/:model_id', Middleware.without_login, Product.AllProductByModelList);
router.post('/get-products-by-category/:category_id', Middleware.without_login, Product.AllProductByCategoryList);
router.get('/detail/:product_id', Middleware.without_login, Product.ProductDetail);
router.post('/bidding', Middleware.verifyToken, Product.Bidding);
// should make sure that values are not null
router.post('/validate-bid', Middleware.verifyToken, Product.ValidateBid);
router.post('/remove-bid', Middleware.verifyToken, Product.RemoveBid);
router.post('/accept-bid', Middleware.verifyToken, Product.AcceptBid);

router.post('/reject-bid', Middleware.verifyToken, [
    check('productId').not().isEmpty().withMessage('Value must be required'),
    check('bidId').not().isEmpty().withMessage('Value must be required'),
], Product.RejectBid);

router.post('/favourite', [
    check('product_id').not().isEmpty().withMessage('Value must be required'),
],
    Middleware.verifyToken, Product.FavouritedProduct);

router.post('/unfavourite', [
    Middleware.verifyToken,
    check('product_id').not().isEmpty().withMessage('Value must be required'),
], Product.UnfavouritedProduct);

router.get('/favourite/list', Middleware.verifyToken, Product.GetFavouritedProductList);

router.post('/buy', [
    check('product_id').not().isEmpty().withMessage('Value must be required'),
    check('address_id').not().isEmpty().withMessage('Value must be required'),
    check('buy_amount').not().isEmpty().withMessage('Value must be required'),
    check('vat').not().isEmpty().withMessage('Value must be required'),
    check('commission').not().isEmpty().withMessage('Value must be required'),
    check('grand_total').not().isEmpty().withMessage('Value must be required'),
],
    Middleware.verifyToken, Product.BuyProduct);

router.post('/question', [
    check('product_id').not().isEmpty().withMessage('Value must be required'),
    check('question').not().isEmpty().withMessage('Value must be required'),
],
    Middleware.verifyToken, Product.PostQuestion);

router.post('/answer', [
    check('question_id').not().isEmpty().withMessage('Value must be required'),
    check('product_id').not().isEmpty().withMessage('Value must be required'),
    check('answer').not().isEmpty().withMessage('Value must be required'),
],
    Middleware.verifyToken, Product.PostAnswer);

router.delete('/:product_id', Middleware.verifyToken, Product.DeleteProduct);
router.put('/renew/:product_id/days/:days', Middleware.verifyToken, Product.ProductRenew);
router.post('/buy-from-bid', [
    check('product_id').not().isEmpty().withMessage('Value must be required'),
    check('address_id').not().isEmpty().withMessage('Value must be required'),
    check('bid_id').not().isEmpty().withMessage('Value must be required'),
],
    Middleware.verifyToken, Product.ProductBuyFromBid);


router.post('/purchase', [
    check('productId').not().isEmpty().withMessage('Value must be required'),
    check('actionType').not().isEmpty().withMessage('Value must be required'),
], Middleware.verifyToken, Product.BuyNow)

router.post('/reserve-financing-product', Middleware.verifyToken, [
    check('orderId').not().isEmpty().withMessage('Value must be required'),
    check('paymentType').not().isEmpty().withMessage('Value must be required'),
], Product.ReserveFinancingProduct);;


module.exports = router;
