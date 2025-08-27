const ReferralLogsService = require('../../../services/log/referralLogsService')
const dataAccessLayer = require('../../../Data/DAL');
const Helper = require('../../../config/helper');


async function getAll(req, res) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const searchValue = req.query.searchValue ? req.query.searchValue : "";

        const referralLogsService = new ReferralLogsService(dataAccessLayer)
        const pageInfo = await referralLogsService.getAll(page, limit, searchValue);
        const logList = { logList: pageInfo.docs, totalResult: pageInfo.total, limit: limit };
        Helper.response(res, 200, "Logs list fetched successfully", logList);

    } catch (error) {
        console.log(error)
        Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
}

module.exports = {
    getAll
}
