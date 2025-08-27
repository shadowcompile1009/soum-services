import { Constants } from '../constants/constant';
import { sendSMS } from './twilio';
import { sendSMSViaUnifonic } from './unifonic';

export function sendSMSViaProvider(
  token: any,
  provider: string,
  phone: string,
  template: number,
  receiver: string = '',
  msg: string = ''
) {
  switch (provider) {
    case Constants.providers.TWILIO:
      return sendSMS(token, phone, template);
    case Constants.providers.UNIFONIC:
      return sendSMSViaUnifonic(receiver, msg);
    default:
      return;
  }
}
