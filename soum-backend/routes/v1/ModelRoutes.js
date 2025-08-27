var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var Model = require('../../controllers/Api/v1/ModelController');

/*routes*/
router.get('/:category_id/:brand_id', Middleware.without_login, Model.AllModelList);
router.post('/', Model.AddModel);
//router.get('/updateModel', Model.updateModel);
//router.post("/multiple-upload", Model.multipleUpload);

module.exports = router;