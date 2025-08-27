const UserModel = require('../../../models/UserModel');
const OrderModel = require('../../../models/OrderModel.js');
const Helper = require('../../../config/helper.js');
const Messages = require('../../../config/messages.js');
const { check, validationResult } = require("express-validator");
const mongoose = require('mongoose');
const ibantools = require('ibantools');
const ProductModel = require('../../../models/ProductModel');
const ProductDAL = require('../../../Data/ProductDAL');
const UserDAL = require('../../../Data/UserDAL');
const OrderDAL = require('../../../Data/OrderDAL');

const activityDAL = require('../../../Data/ActivityDAL');
const ActivityService = require('../../../services/ActivityService');
const activityService = new ActivityService(activityDAL);

const subscriptionDAL = require('../../../Data/SubscriptionDAL');
const SubscriptionService = require('../../../services/SubscriptionService');
const subscriptionService = new SubscriptionService(subscriptionDAL);

const bidDAL = require('../../../Data/BidDAL');
const BidService = require('../../../services/BidService');
const bidService = new BidService(bidDAL);

const SettingDAL = require('../../../Data/SettingDAL');
const dmOrderStatus = require("../../../enums/dmOrderStatus");
const { paymentStatus } = require('../../../config/helper.js');
const { v4: uuidv4 } = require('uuid');

const SlackService = require('../../../services/SlackService');
const slackService = new SlackService();

module.exports = {
    MarkAllAsNotified,
    getTransactionData,
    ConvertOrderToHTML,
    changeProductStatus,
    GetFinishedOrders,
    updateOrderStatus,
    TransactionSave: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }
            const transactionParams = {
                orderId : req.body.order_id,
                sourcePlatform :  req.headers["client-id"],
            }
            const result = await updateOrderStatus(transactionParams);
            console.log(result);
            return Helper.response(res, result.status, result.message, {
                paymentStatus: result.data.paymentStatus,
                paymentType: result.data.paymentType,
            });
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },
    TransactionCancel: (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }
            let user_id = req.user._id;
            let order_id = req.body.order_id;
            let product_id = req.body.product_id;

            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id), buyer: mongoose.Types.ObjectId(user_id) }, (error, result) => {
                if (error) {
                    return Helper.response(res, 500, Messages.api.error[LOCALE]);
                } else if (!result) {
                    return Helper.response(res, 400, Messages.order.not_exists[LOCALE]);
                } else if (result.transaction_status != "Pending") {
                    return Helper.response(res, 400, Messages.order.not_exists[LOCALE]);
                } else {
                    result.transaction_status = 'Fail';
                    OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: result }, async function (err, success) {
                        if (err) {
                            return Helper.response(res, 500, Messages.api.error[LOCALE]);
                        } else {
                            await changeProductStatus(product_id, 'Available');
                            return Helper.response(res, 200, Messages.order.transaction_cancel[LOCALE])
                        }
                    })
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },
    Detail: (req, res) => {
        try {
            let user_id = req.user._id;
            let order_id = req.params.order_id;

            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id) })
                .lean()
                .populate('seller', 'name mobileNumber countryCode profilePic')
                .populate('buyer', 'name mobileNumber countryCode profilePic')
                .populate({
                    path: "product",
                    populate: {
                        path: "category_id",
                        select: "category_name category_name_ar"
                    }
                })
                .populate({
                    path: "product",
                    populate: {
                        path: "brand_id",
                        select: "brand_name brand_name_ar"
                    }
                })
                .populate({
                    path: "product",
                    populate: {
                        path: "model_id",
                        select: "model_name model_name_ar current_price"
                    }
                })
                .exec(async function (error, result) {
                    if (error) {
                        return Helper.response(res, 500, Messages.api.error[LOCALE]);
                    } else if (!result) {
                        return Helper.response(res, 400, Messages.order.not_exists[LOCALE]);
                    } else {
                        if (result.promos && result.promos.buyerPromocodeId) {
                            result.promos.buyerPromocode = result.promos.buyerPromocodeId ? await Helper.getPromoCode(result.promos.buyerPromocodeId) : null
                            delete result.promos.buyerPromocodeId;
                            if (
                                result.discount > 0 &&
                                result.promos.buyerPromocode.promoType === "Percentage"
                              ) {
                                result.promos.buyerPromocode.discount = result.discount;
                              }
                        }
                        if (LOCALE == "ar") {
                            result.product.category_id.category_name = result.product.category_id.category_name_ar;
                            result.product.brand_id.brand_name = result.product.brand_id.brand_name_ar;
                            result.product.model_id.model_name = result.product.model_id.model_name_ar;
                        }
                        const orderData = getDecryptedBankInfo(result);
                        var data = { "OrderData": orderData }
                        return Helper.response(res, 200, Messages.order.detail[LOCALE], data)
                    }
                })
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },

    ShippingDetail: (req, res) => {
        try {
            /*const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }*/
            let user_id = req.user._id;
            let order_id = req.params.order_id;
            //let product_id = req.body.product_id;
            var col = { "buyer_address": 1, "pickup_detail": 1, "shipment_detail": 1, delivery_desc: 1, status: 1, delivery_time: 1 }
            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id) }, (error, result) => {
                if (error) {
                    return Helper.response(res, 500, Messages.api.error[LOCALE]);
                } else if (!result) {
                    return Helper.response(res, 400, Messages.order.not_exists[LOCALE]);
                } else {
                    let delivery_time = result.delivery_time ? result.delivery_time : "";
                    var data = {
                        "ShipData": result.buyer_address, "pickup_detail": result.pickup_detail,
                        "shipment_detail": result.shipment_detail, delivery_desc: result.delivery_desc, status: result.status, delivery_time: delivery_time
                    }
                    return Helper.response(res, 200, Messages.order.ship_detail[LOCALE], data)
                    //result.transaction_status = 'Fail';
                    /*OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: result }, async function (err, success) {
                        if (err) {
                            return Helper.response(res, 500, Messages.api.error[LOCALE]);
                        } else {
                            await changeProductStatus(product_id, 'Available');
                            return Helper.response(res, 200, "Transaction cancelled successfully")
                        }
                    }) */
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },

    "Cancel": (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }

            let order_id = req.body.order_id;
            let return_reason = req.body.return_reason;
            var user_id = req.user._id;
            //console.log(req.body); return false;
            var where = { '_id': mongoose.Types.ObjectId(order_id), 'buyer': mongoose.Types.ObjectId(user_id) };
            var col = {}
            OrderModel.findOne(where, col)
                //.populate("user_id", "name countryCode mobileNumber")
                .exec(function (err, prodExist) {
                    //console.log(prodExist); return false;
                    if (err) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
                    if (prodExist) {
                        OrderModel.findOneAndUpdate(where, { $set: { "return_reason": return_reason, "dispute": "Yes", dispute_date : new Date()  } }, function (err, success) {
                            if (err) {
                                Helper.response(res, 500, Messages.api.fail[LOCALE]);
                            } else {
                                // Helper.send_sms_to_seller(prodExist.product._id, '', '', 'complaint');
                                //await setLastBid(product_id, prodExist.bid_price);
                                bidDAL.UpdateBidStatus(prodExist.bid_id.toString(), Helper.bidStatus.REFUNDED);
                                Helper.send_dispute_message(order_id);
                                Helper.response(res, 200, Messages.order.query[LOCALE]);
                            }
                        });
                    } else {
                        Helper.response(res, 400, Messages.order.not_exists[LOCALE]);
                    }
                });
        } catch (error) {
            //console.log(error);
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }

    },

    BidTransactionSave: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }
            const region = await SettingDAL.SettingValue("region");
            let user_id = req.user._id;
            let bid_id = req.body.bid_id;
            let product_id = req.body.product_id;

            let col = { '_id': 0, user_id, bidding: { $elemMatch: { bid_id: mongoose.Types.ObjectId(bid_id) } } };
            let where = { _id: mongoose.Types.ObjectId(product_id), "bidding.bid_id": mongoose.Types.ObjectId(bid_id) }; //"bidding.user_id": mongoose.Types.ObjectId(user_id),
            ProductModel.findOne(where, col, async function (err, result) {
                if (err) {
                    return Helper.response(res, 500, Messages.api.error[LOCALE]);
                } else if (!result) {
                    return Helper.response(res, 400, Messages.bid.not_exists[LOCALE]);
                } else {
                    var biddingData = result.bidding[0];
                    var transactionData = await getTransactionData(biddingData.checkout_id, biddingData.order_number, biddingData.payment_type);
                    //console.log("transactionData ---", transactionData); 
                    if (transactionData) {
                        var transactionStatus = Helper.check_payment_status_code(transactionData.result);
                        //console.log("transactionStatus ---", transactionStatus); 
                        if (transactionStatus == Helper.paymentStatus.SUCCESS) {
                            var transaction_id = transactionData.id;
                            var registrationId = transactionData.registrationId;
                            var transaction_status = 'Success';
                            var paymentReceivedFromBuyer = 'Yes';
                            var transaction_detail = JSON.stringify(transactionData);
                            var saveobj = {
                                "current_bid_price": biddingData.bid_price,
                                "bidding.$.transaction_id": transaction_id, "bidding.$.transaction_status": transaction_status,
                                "bidding.$.transaction_detail": transaction_detail, "bidding.$.bid_status": Helper.bidStatus.ACTIVE
                            };
                            await bidService.UpdateBidTransaction(bid_id, transaction_status);
                            await bidDAL.UpdateBidStatus(bid_id, Helper.bidStatus.ACTIVE);
                            let returnaction = biddingData.payment_type == 'MADA' ? "refund" : "reversal";
                            let bidAmountReturn = await Helper.apply_transaction_operations(transaction_id, biddingData.payment_type, biddingData.pay_bid_amount, returnaction, region.currency);
                            await rejectBids(product_id, "newBid");
                            //console.log(saveobj); return false;
                            ProductModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product_id), "bidding.bid_id": mongoose.Types.ObjectId(bid_id) }, { $set: saveobj }, async function (err, success) {
                                if (err) {
                                    return Helper.response(res, 500, Messages.api.error[LOCALE]);
                                } else {
                                    if (typeof registrationId !== "undefined")
                                        await saveCardId(user_id, registrationId);
                                    // await returnLastBidderAmount(product_id, "bid");

                                    Helper.send_sms_to_seller(product_id, '', biddingData.bid_price, 'bid_seller');
                                    Helper.send_sms_to_seller(product_id, user_id, biddingData.pay_bid_amount, 'bidder');

                                    activityService.CreateActivity({ creatorId: user_id, productId: product_id, bidValue: biddingData.bid_price, activityType: "Bidding" })
                                    subscriptionService.CreateSubscribtion({ productId: product_id, userId: user_id, activityType: "BuyerBidAccepted" })
                                    subscriptionService.CreateSubscribtion({ productId: product_id, userId: user_id, activityType: "BuyerBidRejected" })

                                    return Helper.response(res, 200, Messages.bid.success[LOCALE])
                                }
                            })
                        } else {
                            var saveobj = { $pull: { "bidding": { "bid_id": mongoose.Types.ObjectId(bid_id) } } };
                            //console.log(saveobj); return false;
                            await bidDAL.UpdateBidStatus(bid_id, Helper.bidStatus.FAILED);
                            ProductModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product_id), "bidding.bid_id": mongoose.Types.ObjectId(bid_id) }, saveobj, async function (err, success) {
                                if (err) {
                                    return Helper.response(res, 500, Messages.api.error[LOCALE]);
                                } else {
                                    //await saveCardId(user_id, registrationId);
                                    return Helper.response(res, 400, transactionData.result.description);
                                }
                            })
                        }
                    } else {
                        await bidDAL.UpdateBidStatus(bid_id, Helper.bidStatus.FAILED);
                        return Helper.response(res, 400, Messages.order.payment_failed[LOCALE]);
                    }
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },

    BidTransactionCancel: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }
            let { product_id } = req.body;
            var user_id = req.user._id;
            let productFound = await ProductDAL.GetFullProductById(product_id);
            if (!productFound) return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
            productFound.bidding = productFound.bidding.filter(bid => bid.user_id.toString() != user_id.toString());

            if (productFound.bidding.length > 0) {
                // this for loop can be done better
                let lastBidIndex = 0;
                for (let index = 0; index < productFound.bidding.length; index++) {
                    if (productFound.bidding[lastBidIndex].bid_price < productFound.bidding[index].bid_price)
                        lastBidIndex = index;
                }
                productFound.current_bid_price = productFound.bidding[lastBidIndex].bid_price;
                //productFound.bidding[lastBidIndex].bid_status = helper.bidStatus.ACTIVE;
                productFound.bidding[lastBidIndex].payment_take = "full";
            } else {
                productFound.current_bid_price = productFound.bid_price;
            }
            await ProductDAL.UpdateProduct(productFound);
            return Helper.response(res, 200, Messages.bid.remove[LOCALE]);
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },

    TrackOrder: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }
            let user_id = req.user._id;
            let shipment_identification_number = req.body.shipment_identification_number;
            let order_id = req.body.order_id;
            let today = new Date().toISOString();
            let PickupTimestamp = today;
            let ref = Helper.generateReferenceNumber(32);
            //Helper.generateRandString();
            //console.log(PickupTimestamp);
            var trackData = await Helper.track_shipment(shipment_identification_number, PickupTimestamp, ref);
            var event = trackData.trackShipmentRequestResponse.trackingResponse.TrackingResponse.AWBInfo.ArrayOfAWBInfoItem.Pieces.PieceEvent;
            var obj = { track_detail: trackData }
            if (typeof event !== "undefined") {
                var EventCode = event.ArrayOfPieceEventItem[0].ServiceEvent.EventCode;
                var Description = event.ArrayOfPieceEventItem[0].ServiceEvent.Description;
                if (EventCode == "OK") {
                    obj.status = "Delivered";
                    obj.delivery_desc = Description;
                    obj.delivery_time = new Date();
                } else {
                    obj.delivery_desc = Description;
                }
            }

            OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: obj }, function (err, success) {
                if (err) {
                    Helper.response(res, 500, Messages.api.fail[LOCALE]);
                } else {
                    let delivery_time = success.delivery_time ? success.delivery_time : "";
                    var result = { "status": success.status, "delivery_time": delivery_time, delivery_desc: success.delivery_desc, "trackData": trackData };
                    return Helper.response(res, 200, Messages.order.track_detail[LOCALE], result);
                    //Helper.response(res, 200, Messages.order.delivered[LOCALE]);
                }
            }); buyerPromocodeId

            //console.log(trackData);
            //var result = {"trackData" : trackData};
            //return Helper.response(res, 200, "Track data", result);
        }
        catch (error) {
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },

    Delivered: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
            }
            let user_id = req.user._id;
            let order_id = req.body.order_id;
            let cols = { "order_number": 1, "seller": 1, "buyer": 1, "product": 1, "buyer_address": 1, "buy_amount": 1, "shipping_charge": 1, "commission": 1, "vat": 1, "grand_total": 1 }
            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id) }, cols)
                .lean()
                .populate('seller', 'name mobileNumber countryCode profilePic bankDetail secretKey')
                .populate('buyer', 'name mobileNumber countryCode profilePic')
                .populate('product', 'pick_up_address')
                .exec(async function (error, result) {
                    if (error) {
                        return Helper.response(res, 500, Messages.api.error[LOCALE]);
                    } else {
                        var orderData = result;
                        var sellerData = result.seller;
                        sellerData.bankDetail.accountId = 'SA4280000621608010034790'; //'SA9650000000033217408001'; //Helper.decrypt(sellerData.bankDetail.accountId, sellerData.secretKey);
                        sellerData.bankDetail.bankBIC = 'RJHISARI'; //'AAALSARI'; //Helper.decrypt(sellerData.bankDetail.bankBIC, sellerData.secretKey);
                        //console.log(sellerData);
                        var sellerAmount = orderData.buy_amount;
                        var baderAmount = orderData.grand_total - orderData.buy_amount;
                        //console.log(orderData.grand_total);

                        /*var tokenData = await Helper.hyper_split_login();
                        if (tokenData) {
                            var success = await Helper.hyper_split(orderData.order_number, sellerData, sellerAmount, baderAmount, tokenData);
                            //console.log(success);
                            if (success) {
                                var splitData = success; //"split_payout_detail": splitData, "paymentMadeToSeller" : "Yes",
                                */
                        OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: { "delivery_time": new Date(), "status": "Delivered" } }, function (err, success) {
                            if (err) {
                                Helper.response(res, 500, Messages.api.fail[LOCALE]);
                            } else {
                                // Helper.send_sms_to_seller(success.product, success.buyer, '', 'delivered');
                                // Helper.send_sms_to_seller(success.product, '', '', 'delivered_seller');
                                //Helper.send_sms_to_seller(product_id, user_id, biddingData.bid_price, 'bidder');
                                Helper.response(res, 200, Messages.order.delivered[LOCALE]);
                            }
                        });
                        //var result = {"splitData" : splitData};
                        //return Helper.response(res, 200, "Delivered", result);
                        /*} else {
                            Helper.response(res, 500, Messages.api.fail[LOCALE]);
                        }
                    } else {
                        Helper.response(res, 500, Messages.api.fail[LOCALE]);
                    }*/
                    }
                });
        }
        catch (error) {
            console.log(error)
            return Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },
}

async function updateOrderStatus({orderNumber, orderId, sourcePlatform, transactionData}) {
    let order = orderId ? await OrderModel.findOne({ _id: mongoose.Types.ObjectId(orderId) }) :
        await OrderModel.findOne({ order_number: orderNumber })
    sourcePlatform = order.sourcePlatform ? order.sourcePlatform : sourcePlatform;
    if (!order) {
        return { status: 400, message: Messages.order.not_exists[LOCALE] };
    } else {
        if (order.transaction_status == 'Success'){
            return { status: 200, message: Messages.order.success[LOCALE], data: { paymentStatus: Helper.paymentStatus.SUCCESS , paymentType : order.payment_type } }
        }
    }
    const transaction = await getHyperpayTransaction(order, transactionData);
   
    // to recheck the status maybe updated in same time of getting the status
    order = orderId ? await OrderModel.findOne({ _id: mongoose.Types.ObjectId(orderId) }) :
        await OrderModel.findOne({ order_number: orderNumber })
    
    if (order.transaction_status == 'Success'){
        return { status: 200, message: Messages.order.success[LOCALE], data: { paymentStatus: Helper.paymentStatus.SUCCESS , paymentType : order.payment_type } }
    }


    let dmo = null;
    if(order.isFinancing){
        dmo = await Helper.getDMO(order.id.toString());
    }
    if (transaction && transaction.transactionStatus == Helper.paymentStatus.SUCCESS) {
        await updateOrderAfterPayment({
            transaction_id: transaction.id,
            transaction_status: transaction.transactionStatus,
            paymentReceivedFromBuyer: 'Yes',
            strData: JSON.stringify(transaction),
            sourcePlatform
        }, order);
        let status='Sold';
        if(order.isFinancing){
            if(dmo && dmo.status && dmo.status.name === dmOrderStatus.APPROVED_BY_FINANCE_COMPANY){
                status='Sold';
            }else{
                status='Available';
            }
        }
        await reflectChangesInProduct(order.product, status);
        const region = await SettingDAL.SettingValue("region");
        if (region.region === "SA"){
            acknowledgeAdmins(order);
        }
        // await sendPickupRequest(order_id);
        // acknowledgeAdmins(order);
        successOrderNotifications(order.buyer.toString(), order.product, "BuyerPaymentCompleted");
        slackService.sendOrderSuccessEmail(order);
        if(order.isFinancing && dmo && dmo.status.name && dmo.status.name === dmOrderStatus.APPROVED_BY_FINANCE_COMPANY){
            await Helper.updateDMOStatus(order._id, dmOrderStatus.WAITING_FOR_VISIT);
        }else{
            await Helper.create_dmo(order._id);
        }
        return { status: 200, message: Messages.order.success[LOCALE], data: { paymentStatus: transaction.transactionStatus, paymentType : order.payment_type } };
    } else if (transaction && (transaction.transactionStatus == Helper.paymentStatus.PENDING || transaction.transactionStatus == Helper.paymentStatus.FAIL)) {
        //order was purchased using financing option and this is second transaction
        //so even if this transaction failed original transaction was successful
        if(dmo && dmo.status && dmo.status.name === dmOrderStatus.APPROVED_BY_FINANCE_COMPANY){
            order.transaction_status = 'Success';
            order.save();
        }else{
            await updateOrderAfterPayment({
                transaction_id: transaction.id,
                transaction_status: transaction.transactionStatus,
                paymentReceivedFromBuyer: 'No',
                strData: JSON.stringify(transaction),
                sourcePlatform
            }, order);
        }
        if (transaction.transactionStatus == Helper.paymentStatus.FAIL)
        {
            await reflectChangesInProduct(order.product, 'Available');
            const userData = await UserDAL.GetFullUser(order.buyer)
            await Helper.log_payment_error({
                userName: userData.name,
                // orderId: order_number,
                soumNumber: order.order_number,
                mobileNumber: userData.mobileNumber,
                errorMessage: transaction.result.description,
                paymentErrorId: uuidv4(),
                paymentProvidor: order.payment_type,
                paymentProvidorType: "HyperPay",
                amount: order.grand_total,
                productId : order.product,
                sourcePlatform : sourcePlatform,
                actionDate : new Date(),
            });
        }
        // Helper.sendMailWithSendGrid(ENV.EMAIL_SENDER, ENV.Order_Status_Inquirer.split(','), `Order -${order.order_number}- Fail`, null, ConvertOrderToHTML(order))
        return {
            status: transaction.transactionStatus == Helper.paymentStatus.FAIL ? 400 : 200 ,
            message: transaction.transactionStatus == Helper.paymentStatus.FAIL ? Messages.order.payment_failed[LOCALE] : Messages.order.payment_pending[LOCALE],
            data: { paymentStatus: transaction.transactionStatus, paymentType : order.payment_type }
        };
    } else {
        //order was purchased using financing option and this is second transaction
        //so even if this transaction failed original transaction was successful
        if(dmo && dmo.status && dmo.status.name === dmOrderStatus.APPROVED_BY_FINANCE_COMPANY){
            order.transaction_status = 'Success';
            order.save();
        }
        else{
            await updateOrderAfterPayment({
                transaction_id: transaction.id ? transaction.id : null,
                transaction_status: 'Fail',
                paymentReceivedFromBuyer: 'No',
                strData: JSON.stringify(transaction),
                sourcePlatform
            }, order);
            const userData = await UserDAL.GetFullUser(order.buyer)
            await Helper.log_payment_error({
                userName: userData.name,
                // orderId: order_number,
                soumNumber: order.order_number,
                mobileNumber: userData.mobileNumber,
                errorMessage: transaction.result.description,
                paymentErrorId: uuidv4(),
                paymentProvidor: order.payment_type,
                paymentProvidorType: "HyperPay",
                amount: order.grand_total,
                productId : order.product,
                sourcePlatform : sourcePlatform,
                actionDate : new Date(),
            });
        }
        await reflectChangesInProduct(order.product, 'Available');
        // Helper.sendMailWithSendGrid(ENV.EMAIL_SENDER, ENV.Order_Status_Inquirer.split(','), `Order -${order.order_number}- Fail`, null, ConvertOrderToHTML(order))
        return { status: 400, message: Messages.order.payment_failed[LOCALE], data: { paymentStatus: transaction.transactionStatus, paymentType : order.payment_type } };

    }
}

async function getHyperpayTransaction(order, transactionData) {
    transactionData = transactionData || await getTransactionData(order.checkout_id, order.order_number, order.payment_type);
    let transactionStatus = transactionData ? Helper.check_payment_status_code(transactionData.result) : Helper.paymentStatus.FAIL;
    var registrationId = transactionData.registrationId;
    if (registrationId)
        await saveCardId(order.buyer.toString(), registrationId);
    return {
        transactionStatus,
        ...transactionData
    };
}

async function updateOrderAfterPayment({ transaction_id, transaction_status, paymentReceivedFromBuyer, strData, sourcePlatform }, order) {

    await OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order._id.toString()) }, {
        $set: {
            transaction_id,
            transaction_status,
            paymentReceivedFromBuyer: paymentReceivedFromBuyer,
            transaction_detail: strData,
            sourcePlatform,
        }
    });
}

async function reflectChangesInProduct(productId, status) {
    if (status == 'Sold')
        await rejectBids(productId, "buy");
    await changeProductStatus(productId, status);
}

async function acknowledgeAdmins(order) {
    if (process.env.NODE_ENV == "production") {
        Helper.send_sms_to_seller(order.product, order.buyer.toString(), order.grand_total, 'buy_buyer');
        Helper.send_sms_to_seller(order.product, '', order.grand_total, 'buy_seller');
        Helper.send_sms("966505594790", `Dear Soum admin the product ( " + ${order.product} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
        Helper.send_sms("966557252760", `Dear Soum admin the product ( " + ${order.product} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
        Helper.send_sms("966552110202", `Dear Soum admin the product ( " + ${order.product} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
        Helper.send_sms("966508674719", `Dear Soum admin the product ( " + ${order.product} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
        Helper.send_sms("966555344521", `Dear Soum admin the product ( " + ${order.product} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
        Helper.send_sms("966534747462", `Dear Soum admin the product ( " + ${order.product} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
    }
    // await Helper.sendMailWithSendGrid(ENV.EMAIL_SENDER, ENV.Order_Status_Inquirer.split(','), `Order -${order.order_number}- Success`, null, ConvertOrderToHTML(order))
}

async function successOrderNotifications(creatorId, productId, activityType) {
    await activityService.CreateActivity({ creatorId, productId, activityType })
}

async function MarkAllAsNotified(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
        }
        let userId = req.user._id;
        await OrderDAL.MarkAllAsNotified(userId);
        return Helper.response(res, 200, "");
    } catch (error) {
        console.log(error);
        return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
}

async function GetFinishedOrders(req, res) {
    try {
        var orders = await OrderDAL.GetFinishedOrders();
        if (typeof orders === "undefined")
            return Helper.response(res, 400, Messages.order.order_list_fail[LOCALE])
        var data = { 'ordersList': orders }
        return Helper.response(res, 200, Messages.order.order_list[LOCALE], data)
    } catch (error) {
        console.log(error);
        return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
}

async function saveCardId(user_id, registrationId, callback) {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user_id) }, { $addToSet: { cards: registrationId } }, function (err, product) {
            if (product) {
                //console.log(product);
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }).catch(err => {
        console.log("in catch block", err);
    });
}

async function changeProductStatus(product_id, sell_status, callback) {
    return new Promise((resolve, reject) => {
        ProductModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product_id), sell_status: { $ne: 'Sold' } }, { $set: { "sell_status": sell_status } }, function (err, product) {
            if (product) {
                //console.log(product);
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }).catch(err => {
        console.log("in catch block", err);
    });
}

async function sendPickupRequest(order_id, callback) {
    return new Promise((resolve, reject) => {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        let PickupTimestamp = tomorrow;
        //console.log("ship");
        OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id) }, { "seller": 1, "buyer": 1, "product": 1, "buyer_address": 1 })
            .lean()
            .populate('seller', 'name mobileNumber countryCode profilePic')
            .populate('buyer', 'name mobileNumber countryCode profilePic')
            .populate('product', 'pick_up_address')
            .exec(async function (error, result) {
                if (result) {
                    //console.log(result);
                    /*result.buyer_address = {
                        "address": "Makkah Al Mukramah",
                        "city": "Jeddah",
                        "postal_code": "12263"
                    };

                    result.product.pick_up_address = {
                        "address": "King Fahd Road",
                        "city": "Riyadh",
                        "postal_code": "300981"
                    };
                    */
                    await Helper.shipment_request(order_id, PickupTimestamp, result.seller, result.product.pick_up_address, result.buyer, result.buyer_address);
                    await Helper.pickup_request(order_id, PickupTimestamp, result.seller, result.product.pick_up_address, result.buyer, result.buyer_address);

                    resolve(true);
                } else {
                    resolve(false);
                }
            });
    }).catch(err => {
        console.log("in catch block", err);
    });
}

function ConvertOrderToHTML(order) {
    return `<p> From ${ENV.NODE_ENV} the product was sold </p> ` + `<br />` +
        `<p>_id: ${order._id}</p><br />` +
        `<p>order_number: ${order.order_number}</p><br />` +
        `<p>payment_type: ${order.payment_type}</p><br />` +
        `<p>transaction_status: ${order.transaction_status}</p><br />` +
        `<p>buy_type: ${order.buy_type}</p><br />` +
        `<p>dispute: ${order.dispute}</p><br />` +
        `<p>buyer: ${order.buyer}</p><br />` +
        `<p>seller: ${order.seller}</p><br />` +
        `<p>product: ${order.product}</p><br />` +
        `<p>buy_amount: ${order.buy_amount}</p><br />` +
        `<p>shipping_charge: ${order.shipping_charge}</p><br />` +
        `<p>vat: ${order.vat}</p><br />` +
        `<p>commission: ${order.commission}</p><br />` +
        `<p>grand_total: ${order.grand_total}</p><br />`;
}

async function getTransactionData(checkoutId, orderNumber, paymentType) {
    // get payment status from checkout 
    var checkoutTransactionData = await Helper.get_payment_status_from_checkout(checkoutId, paymentType);
    
    var checkoutTransactionStatus = Helper.check_payment_status_code(checkoutTransactionData.result);

    if (checkoutTransactionStatus == Helper.paymentStatus.SUCCESS || checkoutTransactionStatus == Helper.paymentStatus.PENDING)
        return checkoutTransactionData;

    // get payment status from reporting service
    var reportingTransactionData = await Helper.get_payment_status_from_reporting(orderNumber, paymentType);
   
    var reportingTransactionStatus = Helper.check_payment_status_code(reportingTransactionData.result);

    if (reportingTransactionStatus == Helper.paymentStatus.FAIL)
        return reportingTransactionData;

    if (reportingTransactionData.payments && reportingTransactionData.payments.length > 0) {
        const successPayment =  reportingTransactionData.payments.filter(elem => elem.paymentType == 'DB').find(elem => Helper.check_payment_status_code(elem.result) == Helper.paymentStatus.SUCCESS)
        if(successPayment) return successPayment;
        return reportingTransactionData.payments[reportingTransactionData.payments.length -1];
    } else {
        return reportingTransactionData;
    }
}

async function rejectBids(productId, action) {
    let product = await ProductDAL.GetFullProductById(productId)
    let bidIndex = -1;
    if (action == "newBid" && product.bidding.length >= 2) {
        let status = product.bidding[product.bidding.length - 2].bid_status;
        if (status == Helper.bidStatus.PENDING || status == Helper.bidStatus.ACTIVE) {
            bidIndex = product.bidding.length - 2;
        } else {
            bidIndex = -1;
        }
    } else if (action == "buy" && product.bidding.length > 1) {
        let status = product.bidding[product.bidding.length - 1].bid_status;
        if (status == Helper.bidStatus.PENDING || status == Helper.bidStatus.ACTIVE) {
            bidIndex = product.bidding.length - 1;
        } else {
            bidIndex = -1;
        }
    }
    if (bidIndex != -1) {
        product.bidding[bidIndex].bid_status = Helper.bidStatus.REJECTED;
        await ProductDAL.UpdateProduct(product)
    }
}

function getDecryptedBankInfo(result) {
    if (result.seller.bankDetail && !ibantools.isValidIBAN(result.seller.bankDetail.accountId)) {
        result.seller.bankDetail.accountId = result.seller.bankDetail.hasOwnProperty("accountId") ?
            Helper.decrypt(result.seller.bankDetail.accountId, result.seller.secretKey) : '' ;
        result.seller.bankDetail.bankBIC = result.seller.bankDetail.hasOwnProperty("bankBIC") ?
            Helper.decrypt(result.seller.bankDetail.bankBIC, result.seller.secretKey) : '';
    }
    if (result.buyer.bankDetail && !ibantools.isValidIBAN(result.buyer.bankDetail.accountId)) {
        result.buyer.bankDetail.accountId = result.buyer.bankDetail.hasOwnProperty("accountId") ?
             Helper.decrypt(result.buyer.bankDetail.accountId, result.buyer.secretKey) : '' ;
        result.buyer.bankDetail.bankBIC = result.buyer.bankDetail.hasOwnProperty("bankBIC") ?
            Helper.decrypt(result.buyer.bankDetail.bankBIC, result.buyer.secretKey) : '';
    }
    return result;
}