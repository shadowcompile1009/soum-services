function SubscriptionService(subscriptionDAL) {

    async function GetSubscriptionList() {
        return []
    }

    async function CreateSubscribtion(subscribtion) {

        if (subscribtion.activityType == "BuyerBidAccepted") {
            await subscriptionDAL.DeactivateOthersSubscribtion(subscribtion.productId, subscribtion.activityType);
        }

        // BuyerBidAccepted && Bidding 
        return await subscriptionDAL.CreateSubscribtion(subscribtion);

    }

    async function GetAllSubscriptionByProdId(prodId, activityType, questionId) {
        return await subscriptionDAL.GetByProdId(prodId, activityType, questionId);
    }

    async function CloseSubscription(ids) {
        return await subscriptionDAL.CloseSubscription(ids);
    }

    return {
        CloseSubscription,
        CreateSubscribtion,
        GetSubscriptionList,
        GetAllSubscriptionByProdId,
    }
}
module.exports = SubscriptionService