const Helper = require("../../../config/helper.js");
const PaymentService = require("../../../services/PaymentService");
const OrderController = require("../../../controllers/Api/v1/OrderController");
const DAL = require("../../../Data/DAL");
async function handlePayment(req, res) {
  try {
    const paymentService = new PaymentService(DAL);

    let reqBody = await paymentService.decryptingBody(
      process.env.NODE_ENV == "production" ? req.body.encryptedBody : req.body,
      req.headers["x-initialization-vector"],
      req.headers["x-authentication-tag"]
    );
    reqBody = JSON.parse(reqBody);
    if (!reqBody) return Helper.response(res, 500, "");
    if (reqBody.type == "PAYMENT") {
      const transactionParams = {
        orderNumber: reqBody.payload.merchantTransactionId,
        transactionData: reqBody.payload,
        sourcePlatform: "Webhook",
      };
      await OrderController.updateOrderStatus(transactionParams);
    }
    return Helper.response(res, 200, "");
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, "");
  }
}

module.exports = {
  handlePayment,
};
