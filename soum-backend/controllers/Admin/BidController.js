const BidDAL = require('../../Data/BidDAL');
const BidService = require('../../services/BidService')
const Helper = require('../../config/helper');
const Messages = require('../../config/messages.js');

async function ListAllBids(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const mobileNumber = req.query.mobileNumber;
  
      if(isNaN(req.query.mobileNumber)) 
        return Helper.response(res, 200, "Bids list", { BidsData: {bidsList: [], totalResult: 0, limit: limit } });

      let bidService = new BidService(BidDAL);
      const pageInfo = await bidService.GetAllBids(page, limit, mobileNumber);
      var bidsList = { bidsList: pageInfo.docs, totalResult: pageInfo.totalDocs, limit: limit };
      return Helper.response(res, 200, "Bids list", { BidsData: bidsList });
    } catch (error) {
      console.log(error);
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  }
  
async function SetlastStatusUpdatedDate(req, res){
  try{
    await BidDAL.SetlastStatusUpdatedDate();
    return Helper.response(res, 200, 'DONE');
  }catch(error){
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

module.exports = {
  ListAllBids,
  SetlastStatusUpdatedDate
}