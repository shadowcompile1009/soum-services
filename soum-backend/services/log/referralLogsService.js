function ReferralLogService(dataLayer) {
    async function logReferralAction(logData, userId) {
        const user = await dataLayer.userDAL.GetUserProfileById(userId);
        logData.user_name = user.name;
        logData.mobile_number = user.mobileNumber;
        logData.user_id = user._id;
        await dataLayer.referralLogDAL.log(logData);
    }

    async function getAll(page, limit, searchValue) {
        return await dataLayer.referralLogDAL.getAll(page, limit, searchValue);
    }

    return {
        logReferralAction,
        getAll,
    }
}
module.exports = ReferralLogService