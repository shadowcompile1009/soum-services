const NotificationDAL = require("../../../Data/NotificationDAL");
const NotificationService = require("../../../services/NotificationService");
const Helper = require("../../../config/helper");
const Messages = require("../../../config/messages.js");
const notification = require("../../../utils/notification");

async function GetCount(req, res) {
  try {
    let userId = req.user._id;
    console.log(userId);
    let notificationService = new NotificationService(NotificationDAL);
    const count = await notificationService.GetCount(userId);
    Helper.response(res, 200, "Notifications Count", {
      notificationCount: count,
    });
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function MarkAsRead(req, res) {
  try {
    let userId = req.user._id;
    let notificationId = req.query.notificationId;
    let notificationService = new NotificationService(NotificationDAL);
    await notificationService.MarkAsRead(userId, notificationId);
    Helper.response(res, 200, "Notification status Updated");
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function GetNotificationlist(req, res) {
  try {
    let userId = req.user._id;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    let notificationService = new NotificationService(NotificationDAL);
    let pageInfo = await notificationService.GetNotificationList(
      userId,
      page,
      limit
    );
    var notificationList = {
      notificationList: pageInfo.docs,
      totalResult: pageInfo.totalDocs,
      limit: limit,
    };
    notificationList.notificationList = notificationList.notificationList.map(
      (a) => {
        if (LOCALE == "ar") {
          a.productData.brandName = a.productData.brandNameAr;
          a.productData.modelName = a.productData.modelNameAr;
        }
        delete a.productData.brandNameAr;
        delete a.productData.modelNameAr;
        return a;
      }
    );
    Helper.response(res, 200, Messages.notification.list[LOCALE], {
      notificationList,
    });
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function ClearAll(req, res) {
  try {
    let userId = req.user._id;

    let notificationService = new NotificationService(NotificationDAL);
    await notificationService.ClearAllNotifications(userId);

    Helper.response(res, 200, Messages.notification.clear[LOCALE]);
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function TestToSendMsgNotification(req, res) {
  try {
    const eventLogRequest = {
      eventType: 'Status Change',
      userId: "607cae098063582dd8ec689a",
      service: "v1",
      messageTitle: "Your order status has been updated",
      messageBody:
        "Changed Order 606a028f52d14b6f84b3f1af status from Active to Disable",
      platform: "IOS",
      isRead: false,
    };
    await notification.createNotificationEvent(eventLogRequest);

    Helper.response(res, 200, Messages.api.success[LOCALE]);
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

module.exports = {
  ClearAll,
  GetCount,
  MarkAsRead,
  GetNotificationlist,
  TestToSendMsgNotification
};
