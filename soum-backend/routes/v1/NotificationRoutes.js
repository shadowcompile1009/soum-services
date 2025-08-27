var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var Middleware = require('../../middleware/auth');

//Controllers
var NotificationContoller = require('../../controllers/Api/v1/NotificationContoller');

/*routes*/
router.get('/count', Middleware.verifyToken, NotificationContoller.GetCount);

router.get('/', Middleware.verifyToken, NotificationContoller.GetNotificationlist);

router.put('/read', Middleware.verifyToken, NotificationContoller.MarkAsRead);

router.put('/clear', Middleware.verifyToken, NotificationContoller.ClearAll);

router.post('/send-msg-notification', NotificationContoller.TestToSendMsgNotification);

module.exports = router;
