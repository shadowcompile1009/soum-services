import { Inject, Injectable, Logger } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { MESSAGE } from './constants/message';
import { ConfigType } from '@nestjs/config';
import emailConfig from '@src/config/email.config';
export type SendMailParams = {
  from?: EmailInput;
  to: EmailInput | EmailInput[];
  cc?: EmailInput | EmailInput[];
  subject: any;
  text?: any;
  html?: string;
  fileName?: string[];
  fileContent?: any[];
  sendGridKey?: string;
};

export type EmailInput = string | { name?: string; email: string };

@Injectable()
export class SendGridClient {
  private logger: Logger;
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConfigData: ConfigType<typeof emailConfig>,
  ) {}

  async send(params: SendMailParams): Promise<[boolean, any]> {

    SendGrid.setApiKey(this.emailConfigData.SENDGRID_API_KEY);
    const attachments = [];
    if (params.fileName && params.fileContent) {
      for (let i = 0; i < params.fileContent.length; i++) {
        attachments.push({
          filename: params.fileName[i],
          content: Buffer.from(params.fileContent[i]).toString('base64'),
        });
      }
    }
    const msg: SendGrid.MailDataRequired = {
      from: this.emailConfigData.SENDGRID_SENDER,
      // from: params.from
      //   ? params.from
      //   : process.env.NODE_ENV === 'production'
      //     ? process.env.SENDGRID_SENDER_PROD
      //     : process.env.SENDGRID_SENDER_DEV,
      to: params.to,
      cc: params.cc,
      subject: params.subject,
      ...(params.text && { text: params.text }),
      ...(params.html && { html: params.html }),
      ...(attachments.length > 0 && { attachments }),
    };
    console.log('msg is >>', JSON.stringify(msg));
    try {
      const result = await SendGrid.send(msg);
      console.log('result is >>', result);
      return [false, { message: MESSAGE.SUCCESS, data: result }];
    } catch (exception) {
      console.log('exception is >>', JSON.stringify(exception.response?.body, null, 2));
      console.log('full exception is >>', JSON.stringify(exception));
      return [true, { message: MESSAGE.FAILED, data: exception }];
    }
  }
}
