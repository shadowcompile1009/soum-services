import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { Constants } from '../constants/constant';
import logger from '../util/logger';

export type EmailInput = string | { name?: string; email: string };
export type SendMailParams = {
  from?: EmailInput;
  to: EmailInput | EmailInput[];
  cc?: EmailInput | EmailInput[];
  subject: any;
  text?: any;
  html?: string;
  fileName?: string;
  fileContent?: any;
  sendGridKey?: string;
};
export async function sendMail(
  params: SendMailParams
): Promise<[boolean, any]> {
  if (params.sendGridKey) {
    sgMail.setApiKey(params.sendGridKey);
  } else {
    sgMail.setApiKey(
      process.env.NODE_ENV === 'production'
        ? process.env.SENDGRID_API_KEY_PROD
        : process.env.SENDGRID_API_KEY_DEV
    );
  }

  const msg: MailDataRequired = {
    from: params.from
      ? params.from
      : process.env.NODE_ENV === 'production'
      ? process.env.SENDGRID_SENDER_PROD
      : process.env.SENDGRID_SENDER_DEV,
    to: params.to,
    subject: params.subject,
    ...(params.text && { text: params.text }),
    ...(params.html && { html: params.html }),
    ...(params.fileContent && {
      attachments: [
        {
          filename: params.fileName || 'daily_orders.xlsx',
          content: Buffer.from(params.fileContent).toString('base64'),
        },
      ],
    }),
  };
  try {
    const result = await sgMail.send(msg);
    return [false, { message: Constants.MESSAGE.EMAIL_SENT, data: result }];
  } catch (exception) {
    logger.error(exception);
    if (exception.response) {
      logger.error(exception.response.body);
    }

    return [
      true,
      { message: Constants.MESSAGE.FAILED_TO_SEND_EMAIL, data: exception },
    ];
  }
}
