const ProductHistoryModel = require('../../models/log/ProductHistoryModel');

const ProductDAL = require('../ProductDAL');
async function Log(productId, logType) {
    let productData =  await ProductDAL.GetFullProductById(productId);
    productData.logType = logType;
    productData.product_Id = productData._id;
    delete productData._id;
    
    return await ProductHistoryModel.create(productData);
}

module.exports = {
    Log
}