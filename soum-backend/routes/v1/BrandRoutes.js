var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var Brand = require('../../controllers/Api/v1/BrandController');

/*routes*/
router.get('/:category_id', Middleware.without_login, Brand.AllBrandList);
router.post('/', Brand.AddBrand);
module.exports = router;