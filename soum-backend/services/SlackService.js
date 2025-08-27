
var moment = require('moment');
const helper = require('../config/helper');

function SlackService() {

    async function sendOrderSuccessEmail(order) {
        await helper.sendMailWithSendGrid(
            ENV.SUCCESS_ORDER_SENDER_EMAIL, 
            ENV.SUCCESS_ORDER_EMAIL, 
            `${moment(order.updated_at).tz("ASIA/RIYADH").format('YYYY-MM-DD HH:mm:ss')} New Order (${order.sourcePlatform}) ${order.grand_total}`, 
            null,
            `OrderID: <a target="_blank" href="${ENV.ADMIN_SITE}/admin/orders/order-details/${order.id.toString()}">${ order.id.toString() }</a>,
             Product: <a target="_blank" href="${ENV.ADMIN_SITE}/admin/products/products-details/${order.product.toString()}">${ order.product.toString() }</a>,
             Price: ${ order.grand_total },
             Channel: ${order.sourcePlatform},
             Payment Methodd: ${order.payment_type}
            `,
        );                    
    }


    return {
        sendOrderSuccessEmail
    }
}

module.exports = SlackService;
