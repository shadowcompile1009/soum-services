var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var Category = require('../../controllers/Api/v1/CategoryController');

/*routes*/
router.get('/', Middleware.without_login, Category.AllCategoryList);
router.post('/', Category.AddCategory);
module.exports = router;