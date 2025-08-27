function NotificationService(notificationDAL) {

    async function GetNotificationList(userId, page, limit) {
        return await notificationDAL.GetNotificationList(userId, page, limit)
    }

    async function CreateNotificationList(notifications) {
       return await notificationDAL.CreateNotifications(notifications)
    }

    async function GetCount(userId) {
        return await notificationDAL.GetCount(userId)
    }
    
    async function MarkAsRead(userId, notificationId) {
        return await notificationDAL.MarkAsRead(userId, notificationId)
    }

    async function ClearAllNotifications(userId) {
        return await notificationDAL.ClearNotificationByUserId(userId);
    }
    return {
        GetCount,
        MarkAsRead,
        GetNotificationList,
        ClearAllNotifications,
        CreateNotificationList,
    }
}
module.exports = NotificationService