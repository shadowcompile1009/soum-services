const userDAL = require('./UserDAL')
const referralLogDAL = require('./log/ReferralLogDAL')
const PaymentStatusDAL = require('./PaymentStatusDAL')
const productDAL = require('./ProductDAL')
const orderDAL = require('./OrderDAL')

module.exports = {
    userDAL,
    referralLogDAL,
    PaymentStatusDAL,
    productDAL,
    orderDAL
}