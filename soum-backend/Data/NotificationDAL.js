const NotificationModel = require('../models/NotificationModel');
const mongoose = require('mongoose');

async function GetByUserId(userId, skip, limit) {
    var aggre = [
        {
            $match: {
                'userData.id': mongoose.Types.ObjectId(userId),
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]

    return await NotificationModel.aggregate(aggre);
}

async function CreateNotifications(notifications) {
    return await NotificationModel.insertMany(notifications);
}

async function CreateNotification(notification) {
    return await NotificationModel.create(notification);
}

async function GetNotificationList(userId, page, limit) {
    return await NotificationModel.paginate({
        'userData.id': mongoose.Types.ObjectId(userId),
    }, {
        page: page,
        limit: limit,
        sort: { createdDate: -1 },
    })
}

async function GetCount(userId) {
    return await NotificationModel.countDocuments({
        'userData.id': mongoose.Types.ObjectId(userId),
        isRead: false,
    })
}

async function ClearNotification(notificationIds) {
    return await NotificationModel.updateMany({
        _id: {
            $in: notificationIds.map(x => mongoose.Types.ObjectId(x))
        }
    }, { $set: { status: 'Seen' } })
}

async function MarkAsRead(userId, notificationId) {
    return await NotificationModel.updateOne({
        // $or: [{ 'userData.id': userId }, { 'sellerData.id': userId }],
        _id: notificationId
    }, { isRead: true, seenDate: new Date() })
}

async function ClearNotificationByUserId(userId) {
    return await NotificationModel.updateMany({
        'userData.id': mongoose.Types.ObjectId(userId),
        isRead: false
    },
        { $set: { isRead: true, seenDate: new Date() } })
}
module.exports = {
    GetCount,
    MarkAsRead,
    GetByUserId,
    ClearNotification,
    CreateNotification,
    CreateNotifications,
    GetNotificationList,
    ClearNotificationByUserId,
}
