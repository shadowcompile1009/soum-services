var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var VarientController = require('../../controllers/Api/v1/VarientController');

/*routes*/
router.get('/:modelId', Middleware.verifyToken, VarientController.AllVarientListByModelId);

module.exports = router;