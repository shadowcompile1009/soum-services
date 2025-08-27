function BidService(BidDAL) {

    async function GetAllBids(page, limit, mobileNumber) {
        return await BidDAL.GetAllBids(page, limit, mobileNumber);
    }

    async function CreateBid(bid) {
        return await BidDAL.CreateBid(bid);
    }

    async function UpdateBidTransaction(bidId, transaction_status) {
        return await BidDAL.UpdateBidTransaction(bidId, transaction_status);
    }
    return {
        CreateBid,
        GetAllBids,
        UpdateBidTransaction,
    }
}

module.exports = BidService