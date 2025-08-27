const ReferralLogModel = require('../../models/log/ReferralLog');

async function log(data) {
    return await ReferralLogModel.create(data);
}

async function getAll(page, limit, searchValue) {

    let aggr = [
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: '$user' },
        { $sort: { created_at: -1 } }
    ]

    if (searchValue) {
        aggr.push(
            {
                $match: {
                    $or: [
                        {  referral_code: { $regex: searchValue, $options: 'i' } },
                        { 'user.name': { $regex: searchValue, $options: 'i' } },
                        { 'user.mobileNumber': { $regex: searchValue, $options: 'i' } },
                    ]
                }
            })
    }

    let total = await ReferralLogModel.aggregate(aggr.concat([{ $count: "rCount" }])).allowDiskUse(true);

    aggr = aggr.concat([
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ])
    let docs = await ReferralLogModel.aggregate(aggr);

    return { total: total[0] ? total[0].rCount : 0, docs, limit }    
}

module.exports = {
    log,
    getAll
}