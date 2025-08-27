var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator');

var Middleware = require('../../middleware/authAdmin');
const AdminController = require('../../controllers/Admin/AdminController');
const CategoryController = require('../../controllers/Admin/CategoryController');
const BrandController = require('../../controllers/Admin/BrandController');
const ModelController = require('../../controllers/Admin/ModelController');
const VarientController = require('../../controllers/Admin/VarientController');
const UserController = require('../../controllers/Admin/UserController');
const SettingController = require('../../controllers/Admin/SettingController');
const ProductController = require('../../controllers/Admin/ProductController');
const QuestionController = require('../../controllers/Admin/QuestionController');
const OrderController = require('../../controllers/Admin/OrderController');
const UserActionController = require('../../controllers/Admin/UserActionController');
const BidController = require('../../controllers/Admin/BidController');
const ConditionController = require('../../controllers/Admin/ConditionController');

/*routes*/
/*
[
    check("name", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").matches(/.+\@.+\..+/)
      .withMessage("Email must contain @"),
    check("password", "Password should be length of at least six digit").isLength({
      min: 6
    })
  ]
*/
router.post('/add', Middleware.verifyToken, AdminController.addAdmin);
router.post('/login', AdminController.login);
router.post('/forgot-password', AdminController.forgot_password);
router.post('/reset-password', AdminController.reset_password);
router.put('/change-password', Middleware.verifyToken, AdminController.change_password);
router.put('/:adminId', Middleware.verifyToken, AdminController.editAdmin);
router.delete('/:adminId', Middleware.verifyToken, AdminController.deleteAdmin);
router.get('/', Middleware.verifyToken, AdminController.adminlist);
router.get('/logout', Middleware.verifyToken, AdminController.Logout);

router.get('/category', Middleware.verifyToken, CategoryController.AllCategoryList);
router.post('/category', Middleware.verifyToken, CategoryController.AddCategory);
router.put('/category/:category_id', Middleware.verifyToken, CategoryController.EditCategory);
router.delete('/category/:category_id', Middleware.verifyToken, CategoryController.DeleteCategory);
router.post('/category/change-order', Middleware.verifyToken, CategoryController.ChangeOrder);

router.get('/brand', Middleware.verifyToken, BrandController.AllBrandList);
router.post('/brand', Middleware.verifyToken, BrandController.AddBrand);
router.put('/brand/:brand_id', Middleware.verifyToken, BrandController.EditBrand);
router.delete('/brand/:brand_id', Middleware.verifyToken, BrandController.DeleteBrand);
router.post('/brand/change-order', Middleware.verifyToken, BrandController.ChangeOrder);

router.get('/model', Middleware.verifyToken, ModelController.AllModelList);
router.post('/model', Middleware.verifyToken, ModelController.AddModel);
router.put('/model/:model_id', Middleware.verifyToken, ModelController.EditModel);
router.delete('/model/:model_id', Middleware.verifyToken, ModelController.DeleteModel);
router.post('/model/change-order', Middleware.verifyToken, ModelController.ChangeOrder);
router.put('/model/assign-question/:model_id', Middleware.verifyToken, ModelController.AssignQuestionToModel);

router.get('/varient', Middleware.verifyToken, VarientController.AllVarientList);
router.post('/varient', Middleware.verifyToken, VarientController.AddVarient);
router.put('/varient/:varient_id', Middleware.verifyToken, VarientController.EditVarient);
router.delete('/varient/:varient_id', Middleware.verifyToken, VarientController.DeleteVarient);
router.post('/varient/change-order', Middleware.verifyToken, VarientController.ChangeOrder);

router.get('/users', Middleware.verifyToken, UserController.users);
router.get('/user/:userId', Middleware.verifyToken, UserController.GetUserDetail);
router.delete('/user/:userId', Middleware.verifyToken, UserController.deleteUser);
router.put('/user/:userId', Middleware.verifyToken, UserController.editUser);
router.put('/user/change-status/:userId', Middleware.verifyToken,
  [
    check("status", "Please select status active or inactive").not().isEmpty(),
  ],
  UserController.userStatus);


router.get('/system-settings', Middleware.verifyToken, SettingController.GetSetting);
router.put('/system-settings/:settingId', Middleware.verifyToken, SettingController.UpdateSetting);

router.get('/products', Middleware.verifyToken, ProductController.productList);
// dont use this route please
router.get('/makeUpdatesInDatabase', Middleware.verifyToken, ProductController.makeUpdatesInDatabase);

router.get('/product/:productId', Middleware.verifyToken, ProductController.ProductDetail);
router.get('/product/bid-detail/:productId', Middleware.verifyToken, ProductController.ProductBidDetail);
router.put('/product/approve/:productId', Middleware.verifyToken,
  [
    check("isApproved", "Please select status").not().isEmpty(),
  ],
  ProductController.approveProduct);
router.delete('/product/:productId', Middleware.verifyToken, ProductController.deleteProduct);
router.post('/product/change-status',
  [
    check('product_id').not().isEmpty().withMessage('Value is required'),
    check('product_status').not().isEmpty().withMessage('Value is required'),
  ], Middleware.verifyToken, ProductController.ChangeProductStatus)

router.post('/product/buy', [
  check('buyer_id').not().isEmpty().withMessage('Value must be required'),
  check('checkout_data_id').not().isEmpty().withMessage('Value must be required'),
  check('product_id').not().isEmpty().withMessage('Value must be required'),
  check('address_id').not().isEmpty().withMessage('Value must be required'),
  check('buy_amount').not().isEmpty().withMessage('Value must be required'),
  check('vat').not().isEmpty().withMessage('Value must be required'),
  check('commission').not().isEmpty().withMessage('Value must be required'),
  check('grand_total').not().isEmpty().withMessage('Value must be required'),

],
  Middleware.verifyToken, ProductController.BuyProduct);

router.delete('/product/:product_id/remove-bid/:bid_id', Middleware.verifyToken, ProductController.RemoveBid);

router.get('/questions', Middleware.verifyToken, QuestionController.AllQuestionList);
router.post('/question',
  [
    check("category_id", "Please select category").not().isEmpty(),
    check("question", "Please enter question").not().isEmpty(),
    check("question_ar", "Please enter question").not().isEmpty(),
    check("questionType", "Please select question type").not().isEmpty(),
    check("weightage", "Please enter weightage").not().isEmpty(),
    //check("options", "Please enter options").not().isEmpty(),
  ],
  Middleware.verifyToken, QuestionController.AddQuestion);

router.put('/question/:question_id',
  [
    check("category_id", "Please select category").not().isEmpty(),
    check("question", "Please enter question").not().isEmpty(),
    check("question_ar", "Please enter question").not().isEmpty(),
    check("questionType", "Please select question type").not().isEmpty(),
    check("weightage", "Please enter weightage").not().isEmpty(),
    //check("options", "Please enter options").not().isEmpty(),
  ],
  Middleware.verifyToken, QuestionController.EditQuestion);

router.put('/question/update-question/:question_id',
  [
    check("category_id", "Please select category").not().isEmpty(),
    check("question", "Please enter question").not().isEmpty(),
    check("question_ar", "Please enter question").not().isEmpty(),
    check("weightage", "Please enter weightage").not().isEmpty(),
    //check("options", "Please enter options").not().isEmpty(),
  ],
  Middleware.verifyToken, QuestionController.UpdateQuestion);

router.put('/question/update-answer/:question_id',
  [
    check("category_id", "Please select category").not().isEmpty(),
    check("option_id", "Please select category").not().isEmpty(),
    check("answer", "Please enter answer").not().isEmpty(),
    check("answer_ar", "Please enter answer").not().isEmpty(),
    check("score", "Please enter score").not().isEmpty(),
    //check("options", "Please enter options").not().isEmpty(),
  ],
  Middleware.verifyToken, QuestionController.UpdateAnswer);
router.delete('/question/delete-question/:question_id', Middleware.verifyToken, QuestionController.DeleteQuestion);
router.delete('/question/delete-answer/:question_id/:option_id', Middleware.verifyToken, QuestionController.DeleteAnswer);

router.get('/orders', Middleware.verifyToken, OrderController.GetAllOrders);
router.get('/order/detail/:order_id', Middleware.verifyToken, OrderController.Detail);
router.get('/order/payout-order-info/:order_id', OrderController.PayoutOrderInfo);

router.post('/order/dispute-status',
  [
    check('order_id').not().isEmpty().withMessage('Value must be required'),
    check('dispute_comment').not().isEmpty().withMessage('Value must be required'),
  ],
  Middleware.verifyToken,
  OrderController.DisputeStatus);

router.post('/order/payout',
  [
    check('orders').not().isEmpty().withMessage('Value must be required'),
  ],
  Middleware.verifyToken,
  OrderController.PayoutOrder);

router.post('/order/transaction/save',
  [
    check("order_id", "Please Enter location").not().isEmpty(),
    check("product_id", "Please Enter full address").not().isEmpty(),
    check("buyer_id", "Please Enter full address").not().isEmpty(),
  ],
  Middleware.verifyToken, OrderController.TransactionSave);
router.delete('/product/comments/:commentId', Middleware.verifyToken, ProductController.InActiveProductComment);

router.get('/action', Middleware.verifyToken, UserActionController.GetAllAction);

router.get('/bid', Middleware.verifyToken, BidController.ListAllBids);

router.get('/comments', Middleware.verifyToken, ProductController.listProductsComments);

router.put('/renew/:product_id/days/:days', Middleware.verifyToken, ProductController.ProductRenewfromAdmin);

router.put('/renewAll/page/:page/limit/:limit/days/:days', Middleware.verifyToken, ProductController.ProductRenewAllfromAdmin);

router.put('/update/bids',Middleware.verifyToken, ProductController.updateBidCollection);

router.put('/update/open/bids',Middleware.verifyToken,ProductController.UpdateBidsCollectionWithOpenStatus);

router.get('/set/lastStatusUpdatedDate',Middleware.verifyToken,BidController.SetlastStatusUpdatedDate);

router.get('/expire/product/:productId', Middleware.verifyToken, ProductController.expireProduct);


// part conditions price nudge
router.get('/condition/:id', Middleware.verifyToken, ConditionController.GetConditionById);
router.post('/add/condition', Middleware.verifyToken, ConditionController.AddNewCondition);
router.put('/condition/:id', Middleware.verifyToken, ConditionController.UpdateCondition);

module.exports = router;