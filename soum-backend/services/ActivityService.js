function ActivityService(activityDAL) {

    async function CreateActivity(activity) {
        console.log('activity : ', activity)
        if (activity == null) throw Error("ActivityError-1");
        if (activity.creatorId == null || activity.productId == null || activity.activityType == null) throw Error("ActivityError-1");
        return await activityDAL.CreateActivity(activity)
    }

    async function GetAllActiveActivity() {
        return await activityDAL.GetAllActiveActivity();
    }

    async function CloseActivity(ids) {
        return await activityDAL.CloseActivity(ids);
    }
    
    return {
        CreateActivity,
        GetAllActiveActivity,
        CloseActivity,
    }
}
module.exports = ActivityService