const PaymentStatusModel = require('../models/PaymentStatusModel');

async function create(data) {
    return await PaymentStatusModel.create({ data });
}

module.exports = {
    create
}
