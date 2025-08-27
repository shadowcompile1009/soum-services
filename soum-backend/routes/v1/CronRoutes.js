var express = require('express');
var router = express.Router();
var Middleware = require('../../middleware/auth');

//Controllers
var Cron = require('../../controllers/Api/v1/CronController');

/*routes*/
router.get('/expire-bids', Cron.AllBiddingList);
router.get('/product-available', Cron.ProductBackToAvailable);
router.get('/send-seller-amount', Cron.SendAmountToSeller);
router.get('/check-delivery-status', Cron.CheckDeliveryStatus);
router.get('/hyper-payout', Cron.HyperSplitPayout);
router.get('/delete-bid', Cron.DeleteBid);
router.get('/expire-bids-collection', Cron.ExpireBids);
router.get('/generate-notifications', Cron.GenerateNotification);
router.get('/notify-expiry', Cron.NotifyUserForExpiredProds);
// router.get('/clean-users', Cron.SanitizeBankDetails);
router.get('/scan-duplicates', Cron.ScanDuplicates);
router.get('/create-duplicate-users', Cron.CreateDuplicateUser);
router.post('/', Cron.AddBank);
module.exports = router;