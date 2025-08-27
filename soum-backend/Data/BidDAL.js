const BidModel = require('../models/BidModel');
const mongoose = require('mongoose');
const Helper = require('../config/helper');

async function GetAllBids(page, limit, mobileNumber) {
    let aggr = [];
    if (mobileNumber)
        aggr.push(
            {
                $match: { $or: [{ buyer_mobile_number: mobileNumber }, { seller_mobile_number: mobileNumber }] }
            }
        );
        
    aggr = aggr.concat([{
        $sort: {
            bid_date: -1 //Sort by Date DESC
        }
    }]);

    let total = await BidModel.aggregate(aggr.concat([{ $count: "rCount" }]))

    aggr = aggr.concat([
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ])
    let docs = await BidModel.aggregate(aggr)

    return { totalDocs: total[0] ? total[0].rCount : 0, docs, limit }
}

async function GetAllOpenBids() {
    var aggregate = [
        {
            $match: {bid_status: 'open'}
        },
        {
            $project: {
                _id: 1,
                bidId: 1,
                bidder: 1,
                bid_status: 1,
                transaction_status: 1
            }
        }
    ]
    return await BidModel.aggregate(aggregate);
}

async function GetAllRuinedBids() {
    var aggregate = [
        {
            $match: {
                $or: [{ 'transaction_status': 'Pending' }, { 'bid_status': Helper.bidStatus.PENDING }, { 'bid_status': Helper.bidStatus.ACTIVE }]
            }
        },
        { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
        { $unwind: '$product' },
        { $lookup: { from: "users", localField: "bidder", foreignField: "_id", as: "buyer" } },
        { $unwind: '$buyer' },
        { $lookup: { from: "device_models", localField: "product.model_id", foreignField: "_id", as: "model" } },
        { $unwind: "$model" },
        {
            $project: {
                _id: 1,
                seller_mobile_number: 1,
                bidder_id: '$buyer._id',
                bidder_name: '$buyer.name',
                bidder_countryCode: '$buyer.countryCode',
                bidder_mobile: '$buyer.mobileNumber',
                product_id: '$product._id',
                product_name: '$model.model_name',
                product_sell_price: '$product.sell_price',
                'buy_amount':1,
                'bid_date': 1
            }
        }
    ]
    return await BidModel.aggregate(aggregate);
}

async function SetlastStatusUpdatedDate() {
   return await BidModel.updateMany({}, {$set: {'lastStatusUpdatedDate': new Date()}});
}

async function GetAllOutDatedBids() {
    var aggregate = [
        {
            $match: {
                $or: [{ 'bid_status': Helper.bidStatus.ACCEPTED }, { 'bid_status': Helper.bidStatus.ACTIVE }]
            }
        },
        {
            $project: {
                _id: 1,
                bid_date: 1,
                bid_status: 1,
                lastStatusUpdatedDate: 1,
                productId: 1
            }
        }
    ]
    let arrayOfBids = await BidModel.aggregate(aggregate);
    let arrOfOutDatedBids = [];
    for (let index = 0; index < arrayOfBids.length; index++) {
        let lastStatusUpdatedDate = arrayOfBids[index].lastStatusUpdatedDate;
        let date = new Date (lastStatusUpdatedDate);
        date.setDate(date.getDate() + Helper.constDays.DaysToBeExpired);
        if(new Date() >= date){
            arrOfOutDatedBids.push(arrayOfBids[index]);
        }
    }
    return arrOfOutDatedBids;
}

async function ExpireOutDatedBids(arrayOfBids) {
    let bulk = [];
    for (let i = 0; i < arrayOfBids.length; i++) {
        let bidId = arrayOfBids[i]._id.toString();  
        let query = {"_id": mongoose.Types.ObjectId(bidId)};
        bulk.push(
            {
                updateOne: {
                    filter: 
                        query,
                    update: {
                        $set: { bid_status: Helper.bidStatus.EXPIRED }
                    }
                }
            }
        );
    }
    return await BidModel.bulkWrite(bulk);
}

async function CreateBid(bid) {
    return await BidModel.create(bid);
}

async function UpdateBidTransaction(bidId, transaction_status) {
    return await BidModel.updateOne({ bidId }, { transaction_status });
}

async function UpdateBidStatus(bidId, state) {
    let query = { $or: [{ biddId: mongoose.Types.ObjectId(bidId) }, { bidId: mongoose.Types.ObjectId(bidId) }] };
    let updatedBid = await BidModel.findOneAndUpdate(query, { $set : { bid_status: state ,lastStatusUpdatedDate: new Date()} });
    return updatedBid;
}

async function SetBidDeletedBy(bidId, userId, deletedBy) {
    let query = { $or: [{ biddId: mongoose.Types.ObjectId(bidId) }, { bidId: mongoose.Types.ObjectId(bidId) }] };
    let updatedBid = await BidModel.findOneAndUpdate(query, { $set : { deletedBy: userId, deletedByUserType: deletedBy } });
    return updatedBid;
}

async function UpdateBulkBidStatus(arrayOfBids) {
    let bulk = [];
    for (let i = 0; i < arrayOfBids.length; i++) {
        var bidId = arrayOfBids[i].bid_id.toString();
        var status = arrayOfBids[i].bid_status.toString();
        let query = { $or: [{ biddId: mongoose.Types.ObjectId(bidId) }, { bidId: mongoose.Types.ObjectId(bidId) }] };
        bulk.push(
            {
                updateOne: {
                    filter: 
                        query,
                    update: {
                        $set: { bid_status: status }
                    }
                },
            },
        );
    }
    return await BidModel.bulkWrite(bulk);
}

async function UpdateBulkBidsWithOpenStatus(arrayOfBids) {
    let bulk = [];
    for (let i = 0; i < arrayOfBids.length; i++) {
        let transaction_status = arrayOfBids[i].transaction_status.toString();
        let status = arrayOfBids[i].bid_status.toString();
        var bidId = arrayOfBids[i]._id.toString();
        let bid_state = status;
        if(transaction_status == 'Pending' && status == 'open'){
            bid_state = Helper.bidStatus.PENDING;
        }
        else if(transaction_status == 'Success' && status == 'open'){
            bid_state = Helper.bidStatus.ACTIVE;
        }
        
        let query = {"_id": mongoose.Types.ObjectId(bidId)};
        bulk.push(
            {
                updateOne: {
                    filter: 
                        query,
                    update: {
                        $set: { bid_status: bid_state }
                    }
                },
            },
        );
    }
    return await BidModel.bulkWrite(bulk);
}

module.exports = {
    CreateBid,
    GetAllBids,
    GetAllOpenBids,
    GetAllRuinedBids,
    SetlastStatusUpdatedDate,
    GetAllOutDatedBids,
    ExpireOutDatedBids,
    UpdateBidTransaction,
    UpdateBidStatus,
    SetBidDeletedBy,
    UpdateBulkBidStatus,
    UpdateBulkBidsWithOpenStatus
}
