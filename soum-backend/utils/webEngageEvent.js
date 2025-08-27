const axios = require("axios");

const sendEventData = async (userId, eventName, eventTime, eventData) => {
  const webEngageBase = process.env.WEB_ENGAGE_BASE || 'https://api.in.webengage.com';
  const license_code = process.env.WEB_ENGAGE_LISENCE_CODE || 'in~76aa301';
  const webEngageAPIKey = process.env.WEB_ENGAGE_API_KEY || 'f1352231-143c-4f09-8910-102e1698ba90';
  await axios
    .post(`${webEngageBase}/v1/accounts/${license_code}/events`,
      {
        "userId": userId,
        "eventName": eventName,
        "eventTime": eventTime.toString(),
        "eventData": eventData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${webEngageAPIKey}`,
        },
      })
    .catch(error => logger.error(error));
}

module.exports = {
  sendEventData
};
