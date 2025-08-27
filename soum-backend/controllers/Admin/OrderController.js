const OrderModel = require('../../models/OrderModel.js');
const Helper = require('../../config/helper.js');
const Messages = require('../../config/messages.js');
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');
const ibantools = require('ibantools');
const ProductModel = require('../../models/ProductModel');
const ProductQuestionDAL = require('../../Data/ProductQuestionDAL')
const OrderDAL = require('../../Data/OrderDAL')
const ErrorLogDAL = require('../../Data/log/ErrorLogDAL')
const paymentLogs = require('../../models/log/PaymentLogs')
const SettingDAL = require('../../Data/SettingDAL')
const UserDAL = require('../../Data/UserDAL')
const bidDAL = require('../../Data/BidDAL');
async function PayoutOrder(req, res) {
    let { orderId, buyer_commission_percentage, seller_commission_percentage, shipping_charge_percentage, vat_percentage } = req.body;
    try {
        let orderData = await OrderDAL.GetById(orderId);
        var order_id = orderData._id;
        var sellerData = orderData.seller;

        sellerData.bankDetail.accountId = Helper.decrypt(sellerData.bankDetail.accountId, sellerData.secretKey);
        sellerData.bankDetail.bankBIC = Helper.decrypt(sellerData.bankDetail.bankBIC, sellerData.secretKey);

        var buyerTotalCommission = (orderData.buy_amount * buyer_commission_percentage) / 100;
        var sellerTotalCommission = (orderData.buy_amount * seller_commission_percentage) / 100;
        var totalVat = (buyerTotalCommission * vat_percentage) / 100 + (sellerTotalCommission * vat_percentage) / 100;
        var sellerAmount = orderData.grand_total - (sellerTotalCommission + buyerTotalCommission + totalVat);
        var soumAmount = buyerTotalCommission + sellerTotalCommission + totalVat;

        var tokenData = await Helper.hyper_split_login();
        console.log(tokenData)
        if (tokenData) {
            new paymentLogs({
                data: JSON.stringify({
                    type: "Payout input", data: { order_number: orderData.order_number, sellerData, sellerAmount, soumAmount, tokenData }
                })
            }).save((error, result) => { });
            var splitData = await Helper.hyper_split(orderData.order_number, sellerData, sellerAmount, soumAmount, tokenData);
            if (splitData && (typeof splitData.error == "undefined" || splitData.error.length === 0)) {
                new paymentLogs({
                    data: JSON.stringify({
                        type: "Payout success output", splitData
                    })
                }).save((error, result) => { });

                OrderModel.updateOne({ _id: mongoose.Types.ObjectId(order_id) }, { $set: { "split_payout_detail": splitData, "paymentMadeToSeller": "Yes", commission_percentage: { buyer_commission_percentage, seller_commission_percentage, shipping_charge_percentage, vat_percentage } } }, async function (err, success) {
                    if (err) {
                        return Helper.response(res, 400, Messages.payout.fail[LOCALE]);
                    } else {
                        return Helper.response(res, 200, Messages.payout.success[LOCALE]);
                    }
                });
            } else {
                new paymentLogs({
                    data: JSON.stringify({
                        type: "Payout fail output", splitData
                    })
                }).save((error, result) => { });
                return Helper.response(res, 400, Messages.payout.fail[LOCALE]);
            }
        } else {
            return Helper.response(res, 400, Messages.payout.tokenFail[LOCALE]);
        }
    } catch (error) {
        console.log(error)
        await ErrorLogDAL.Log(error, "Order-Admin", "PayoutOrders", 500, {})
        return Helper.response(res, 500, "Something went wrong!");
    }
}

async function PayoutOrderInfo(req, res) {
    try {
        let orderId = req.params.order_id;
        let orderData = await OrderDAL.GetPayOutInfo(orderId);

        if (!orderData) return Helper.response(res, 400, Messages.order.not_exists[LOCALE]);

        if (typeof orderData.commission_percentage === "undefined") {
            let { buyer_commission_percentage, seller_commission_percentage, shipping_charge_percentage, vat_percentage } = await SettingDAL.GetSetting();
            orderData.commission_percentage = {
                buyer_commission_percentage,
                seller_commission_percentage,
                shipping_charge_percentage,
                vat_percentage
            }
        }

        var returnData = { "orderData": orderData };
        return Helper.response(res, 200, Messages.order.detail[LOCALE], returnData);
    } catch (error) {
        console.log(error)
        await ErrorLogDAL.Log(error, "Order-Admin", "PayoutOrderInfo", 500, {})
        return Helper.response(res, 500, "Something went wrong!");
    }
}

module.exports = {
    PayoutOrder,

    PayoutOrderInfo,

    GetAllOrders: async (req, res) => {
        try {
            const region = await SettingDAL.SettingValue("region");
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            let searchValue = req.query.searchValue;
            const dispute = req.query.dispute;
            let userFound = await UserDAL.GetAnyUser(region.code, searchValue)
            if (userFound) searchValue = userFound._id;
            let result = await OrderDAL.GetAllOrdersForAdminListing(page, limit, searchValue, dispute)

            result.docs.map(async function (item) {
                item.isReadyToPayout = item.transaction_status == "Success" && item.dispute == "No" && item.paymentMadeToSeller == "No" ? true : false;
            });
            return Helper.response(res, 200, "Order detail fetched successfully", {
                orderList: result.docs,
                totalResult: result.total,
                limit: limit
            })
        }
        catch (error) {
            console.log(error)
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    Detail: (req, res) => {
        try {
            let order_id = req.params.order_id;
            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id) })
                .lean()
                .populate('seller', 'name mobileNumber countryCode profilePic bankDetail secretKey address')
                .populate('buyer', 'name mobileNumber countryCode profilePic bankDetail secretKey')
                .populate({
                    path: "product",
                    populate: {
                        path: "category_id",
                        select: "category_name"
                    }
                })
                .populate({
                    path: "product",
                    populate: {
                        path: "brand_id",
                        select: "brand_name"
                    }
                })
                .populate({
                    path: "product",
                    populate: {
                        path: "model_id",
                        select: "model_name current_price"
                    }
                })
                .exec(async function (error, result) {
                    if (error) {
                        return Helper.response(res, 500, "Internal server error.");
                    } else if (!result) {
                        return Helper.response(res, 400, "Order not exists");
                    } else {
                        if (result.promos && result.promos.buyerPromocodeId) {
                            result.promos.buyerPromocode = result.promos.buyerPromocodeId ? await Helper.getPromoCode(result.promos.buyerPromocodeId) : null
                            delete result.promos.buyerPromocodeId;
                        }
                        result.isReadyToPayout = result.transaction_status == "Success" && result.dispute == "No" && result.paymentMadeToSeller == "No" ? true : false;
                        result.product.product_questions = await ProductQuestionDAL.QetProductQuestions(result.product._id);
                        const orderData = getDecryptedBankInfo(result);
                        var data = { "OrderData": orderData }
                        return Helper.response(res, 200, "Order detail fetched successfully", data)
                    }
                })
        }
        catch (error) {
            //console.log(error)
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    TransactionSave: (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, "Parameter missing", { errors: errors.array() });
            }
            let user_id = req.body.buyer_id;
            let order_id = req.body.order_id;
            let product_id = req.body.product_id;
            //let transaction_detail = req.body.transaction_detail;

            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id), buyer: mongoose.Types.ObjectId(user_id) }, async (error, result) => {
                if (error) {
                    return Helper.response(res, 500, "Internal server error.");
                } else if (!result) {
                    return Helper.response(res, 400, "Order not exists");
                } else if (result.transaction_status != "Pending") {
                    return Helper.response(res, 400, "Order not exists");
                } else {
                    //Helper.get_payment_status("E95DE3C602CC40F00845F9E8E036CD06.uat01-vm-tx03"); 
                    //Helper.get_transaction_report("8ac7a4a0774de14801774de5c30e00aa");
                    var transactionData = await getTransactionData(result.checkout_id, result.order_number, result.payment_type);
                    if (transactionData) {
                        //console.log("das", checkoutData.id); return false;
                        //let transactionCode = transactionData.result.code;
                        /*var transactionData = {
                            "id": "8ac7a49f77478e1d01774db61e5421ea",
                            "paymentType": "DB",
                            "paymentBrand": "VISA",
                            "amount": "100.00",
                            "currency": "SAR",
                            "descriptor": "2809.6447.8346  Soum online",
                            "result": {
                                "code": "000.100.110",
                                "description": "Request successfully processed in 'Merchant in Integrator Test Mode'"
                            }
                        };*/
                        //var j = {"code": "000.100.110"}
                        var transactionStatus = Helper.check_payment_status_code(transactionData.result);
                        if (transactionStatus) {
                            var transaction_id = transactionData.id;
                            result.transaction_id = transaction_id;
                            result.transaction_status = 'Success';
                            result.transaction_detail = JSON.stringify(transactionData);
                            result.sourcePlatform = req.headers["client-id"];
                            OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: result }, async function (err, success) {
                                if (err) {
                                    return Helper.response(res, 500, "Internal server error.");
                                } else {
                                    await bidDAL.UpdateBidStatus(result.bid_id ,Helper.bidStatus.PAID);
                                    
                                    if(result.isFinancing){
                                        await changeProductStatus(product_id, 'Available');
                                    }else{
                                        await changeProductStatus(product_id, 'Sold');
                                    }
                                    return Helper.response(res, 200, "Transaction save and order send successfully")
                                }
                            })
                        } else {

                            result.transaction_status = 'Fail';
                            result.transaction_detail = JSON.stringify(transactionData);
                            result.sourcePlatform = req.headers["client-id"];
                            OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: result }, async function (err, success) {
                                if (err) {
                                    return Helper.response(res, 500, "Internal server error.");
                                } else {
                                    await changeProductStatus(product_id, 'Available');
                                    return Helper.response(res, 400, transactionData.result.description);
                                }
                            })
                        }
                    } else {
                        await changeProductStatus(product_id, 'Available');
                        return Helper.response(res, 400, "Payment not success, try again!");
                    }
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    TransactionCancel: (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, "Parameter missing", { errors: errors.array() });
            }
            let user_id = req.user._id;
            let order_id = req.body.order_id;
            let product_id = req.body.product_id;

            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id), buyer: mongoose.Types.ObjectId(user_id) }, (error, result) => {
                if (error) {
                    return Helper.response(res, 500, "Internal server error.");
                } else if (!result) {
                    return Helper.response(res, 400, "Order not exists");
                } else if (result.transaction_status != "Pending") {
                    return Helper.response(res, 400, "Order not exists");
                } else {
                    result.transaction_status = 'Fail';
                    OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: result }, async function (err, success) {
                        if (err) {
                            return Helper.response(res, 500, "Internal server error.");
                        } else {
                            await changeProductStatus(product_id, 'Available');
                            return Helper.response(res, 200, "Transaction cancelled successfully")
                        }
                    })
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    ShippingDetail: (req, res) => {
        try {
            /*const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, "Parameter missing", { errors: errors.array() });
            }*/
            let user_id = req.user._id;
            let order_id = req.params.order_id;
            //let product_id = req.body.product_id;

            OrderModel.findOne({ _id: mongoose.Types.ObjectId(order_id), buyer: mongoose.Types.ObjectId(user_id) }, (error, result) => {
                if (error) {
                    return Helper.response(res, 500, "Internal server error.");
                } else if (!result) {
                    return Helper.response(res, 400, "Order not exists");
                } else {
                    var data = { "ShipData": result.buyer_address }
                    return Helper.response(res, 200, "Shipping detail fetched successfully", data)
                    //result.transaction_status = 'Fail';
                    /*OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: result }, async function (err, success) {
                        if (err) {
                            return Helper.response(res, 500, "Internal server error.");
                        } else {
                            await changeProductStatus(product_id, 'Available');
                            return Helper.response(res, 200, "Transaction cancelled successfully")
                        }
                    }) */
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    "Cancel": (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, "Parameter missing", { errors: errors.array() });
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
                        OrderModel.findOneAndUpdate(where, { $set: { "return_reason": return_reason, "dispute": "Yes" } }, function (err, success) {
                            if (err) {
                                Helper.response(res, 500, Messages.api.fail[LOCALE]);
                            } else {
                                //await setLastBid(product_id, prodExist.bid_price);
                                Helper.response(res, 200, "Your query submitted succesfully");
                            }
                        });
                    } else {
                        Helper.response(res, 400, "Order not found");
                    }
                });
        } catch (error) {
            //console.log(error);
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }

    },

    "DisputeStatus": async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 400, "Parameter missing", { errors: errors.array() });
            }
            const region = await SettingDAL.SettingValue("region");
            let order_id = req.body.order_id;
            let dispute_comment = req.body.dispute_comment;
            let dispute_validity = req.body.dispute_validity ? req.body.dispute_validity : "";
            //var user_id = req.user._id;
            //console.log(req.body); return false;
            var where = { '_id': mongoose.Types.ObjectId(order_id) };
            var col = {}
            OrderModel.findOne(where, col)
                //.populate("user_id", "name countryCode mobileNumber")
                .exec(function (err, prodExist) {
                    //console.log(prodExist); return false;
                    if (err) { Helper.response(res, 500, Messages.api.fail[LOCALE]); }
                    if (prodExist) {
                        OrderModel.findOneAndUpdate(where, { $set: { "dispute_comment": dispute_comment, "dispute_validity": dispute_validity } }, async function (err, success) {
                            if (err) {
                                Helper.response(res, 500, Messages.api.fail[LOCALE]);
                            } else {
                                if (dispute_validity == "Valid") {
                                    Helper.send_sms_to_seller(prodExist.product, prodExist.seller, '', 'dvs');
                                    Helper.send_sms_to_seller(prodExist.product, prodExist.buyer, '', 'dvb');
                                    Helper.apply_transaction_operations(prodExist.transaction_id, prodExist.payment_type, prodExist.grand_total, "refund", region.currency);
                                } else if (dispute_validity == "Invalid") {
                                    Helper.send_sms_to_seller(prodExist.product, prodExist.seller, '', 'dis');
                                    Helper.send_sms_to_seller(prodExist.product, prodExist.buyer, '', 'dib');
                                    await sendAmount(order_id);
                                }
                                //await setLastBid(product_id, prodExist.bid_price);
                                Helper.response(res, 200, "submitted succesfully");
                            }
                        });
                    } else {
                        Helper.response(res, 400, "Order not found");
                    }
                });
        } catch (error) {
            //console.log(error);
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }

    },
}

async function sendAmount(order_id, callback) {
    return new Promise((resolve, reject) => {
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
                    sellerData.bankDetail.accountId = 'SA9650000000033217408001'; //Helper.decrypt(sellerData.bankDetail.accountId, sellerData.secretKey);
                    sellerData.bankDetail.bankBIC = 'AAALSARI'; //Helper.decrypt(sellerData.bankDetail.bankBIC, sellerData.secretKey);
                    //console.log(sellerData);
                    var sellerAmount = orderData.buy_amount;
                    var soumAmount = orderData.grand_total - orderData.buy_amount;
                    //console.log(orderData.grand_total);
                    var tokenData = await Helper.hyper_split_login();
                    if (tokenData) {
                        var success = await Helper.hyper_split(orderData.order_number, sellerData, sellerAmount, soumAmount, tokenData);
                        if (success) {
                            var splitData = success;
                            OrderModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(order_id) }, { $set: { "split_payout_detail": splitData, "paymentMadeToSeller": "Yes", "status": "Delivered" } }, function (err, success) {
                                if (err) {
                                    resolve(false)
                                } else {
                                    resolve(true)
                                }
                            });
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }
                }
            });
    })
}

async function changeProductStatus(product_id, sell_status, callback) {
    return new Promise((resolve, reject) => {
        ProductModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product_id) }, { $set: { "sell_status": sell_status } }, function (err, product) {
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

async function getTransactionData(checkoutId, orderNumber, paymentType) {
    // get payment status from checkout 
    var checkoutTransactionData = await Helper.get_payment_status_from_checkout(checkoutId, paymentType);
    // get payment status from reporting service
    var reportingTransactionData = await Helper.get_payment_status_from_reporting(orderNumber, paymentType);
    // check in request status 
    var checkoutTransactionStatus = Helper.check_payment_status_code(checkoutTransactionData.result);
    var checkoutPaymentStatus = false;

    var reportingTransactionStatus = Helper.check_payment_status_code(reportingTransactionData.result);
    var reportingPaymentStatus = false;


    if (checkoutTransactionStatus) {
        checkoutPaymentStatus = checkoutTransactionData.payments.length > 0 && checkoutTransactionData.payments[0].result ?
            Helper.check_payment_status_code(checkoutTransactionData.payments[0].result) : false;
    }
    if (reportingTransactionStatus) {
        reportingPaymentStatus = reportingTransactionData.payments.length > 0 && reportingTransactionData.payments[0].result ?
            Helper.check_payment_status_code(reportingTransactionData.payments[0].result) : false;
    }

    // if checkout and payment is true then return checkout status result 
    if (checkoutTransactionStatus && checkoutPaymentStatus) {
        return checkoutTransactionData;
    }
    // if checkout and payment is true then return reporting status result 
    else if (reportingTransactionStatus && reportingPaymentStatus) {
        return reportingTransactionData;
    }
    else if (checkoutTransactionStatus && !checkoutPaymentStatus) {
        return checkoutTransactionData;
    } else {
        return reportingTransactionData;
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