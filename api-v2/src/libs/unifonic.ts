import request from 'request';
import logger from '../util/logger';
export function sendSMSViaUnifonic(receiver: string, message: string) {
  return new Promise(function (resolve, reject) {
    const options = {
      method: 'POST',
      url:
        'http://basic.unifonic.com/wrapper/sendSMS.php?appsid=QUFPEaHqZArfT38GFkglljUFlz7Vcb&msg=' +
        message +
        '&to=' +
        receiver +
        '&sender=SOUM&baseEncode=False&encoding=UCS2&responseType=JSON',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic QmFzaWNBdXRoVXNlck5hbWU6QmFzaWNBdXRoUGFzc3dvcmQ=',
      },
    };
    request(options, function (error, res, body) {
      if (!error) {
        logger.info('Successfully send rejected bid SMS message');
        logger.info(res.body);
        logger.info(body);
        resolve(true);
      } else {
        logger.error(`Fail to send rejected bid SMS via Unifonic. ${error}`);
        reject(false);
      }
    });
  });
}
