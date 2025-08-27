var express = require('express');
var router = express.Router();

//Controllers
var ConditionController = require('../../controllers/Api/v1/ConditionController');

/*routes*/
router.get('/:id', ConditionController.GetConditionById);

module.exports = router;