import config from 'config';
import crypto from 'crypto';
import { Twilio } from 'twilio';
import { Constants } from '../constants/constant';
import { generateOTP } from '../util/common';

const Config = config.get('App') as any;
const client = new Twilio(Config.twilio.accountSid, Config.twilio.authToken);

const smsKey = Config.twilio.secretKey;

export function sendSMS(
  reset_password_token: any,
  phone: any,
  template: number
) {
  let body = '';
  switch (template) {
    case Constants.templates.PHONE_VERIFICATION_OTP_CODE:
      body = 'Your One Time Login Password For App is $$OTP$$';
      // replace variables
      const otp = generateOTP(Constants.twilio.OTP_MAX_LENGTH) as any;
      body = body.replace(Constants.variables.OTP, otp);
      const expires = Date.now() + 2 * 60 * 1000;
      const data = `${phone}.${otp}.${expires}`;
      const hash = crypto
        .createHmac('sha256', smsKey)
        .update(data)
        .digest('hex');
      const fullHash = `${hash}.${expires}`;

      client.messages
        .create({
          body: body,
          from: Config.twilio.fromNumber,
          to: phone,
        })
        .then(messages => console.log(messages))
        .catch(exception => console.error(exception));
      return { phone, hash: fullHash };

    case Constants.templates.PASSWORD_RESET_SMS:
      body =
        'Hello, please click the link to reset your password.  $$PASSWORD_RESET_URL$$$$PASSWORD_RESET_ID$$';
      body = body.replace(
        Constants.variables.PASSWORD_RESET_URL,
        Config.password_reset_url
      );
      body = body.replace(
        Constants.variables.PASSWORD_RESET_ID,
        !reset_password_token ? '' : reset_password_token
      );

      client.messages
        .create({
          body: body,
          from: Config.twilio.fromNumber,
          to: phone,
        })
        .then(messages => console.log(messages))
        .catch(exception => console.error(exception));
      return 'Password reset request accepted';
    default:
      return;
  }
}
