import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  SendOutboundMsgRequestDTO,
  SendOutboundMsgResponseDTO,
} from './dto/freshchat.dto';
import FreshchatMessageStatus from './freshchat.message.status.enum';

@Injectable()
export class FreshChatService {
  private readonly logger = new Logger(FreshChatService.name);
  private readonly httpService = new HttpService();

  async sendOutboundMsg(
    params: SendOutboundMsgRequestDTO,
  ): Promise<SendOutboundMsgResponseDTO> {
    try {
      const otpResponse = await this.httpService.axiosRef.post(
        `${process.env.FRESHCHAT_API_URI}/v2/outbound-messages/whatsapp`,
        this.createTemplate(params),
        {
          headers: {
            Authorization: `Bearer ${process.env.FRESHCHAT_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!otpResponse.data.request_id) this.logger.error('SMS_OTP_FAILED');

      await this.delay(1000); // Wait until freshchat update request status

      const sentMessage = await this.getOutboundMsg(
        otpResponse.data.request_id,
      );
      const outboundMessage = sentMessage?.outbound_messages?.[0];

      if (
        outboundMessage &&
        outboundMessage.status !== FreshchatMessageStatus.FAILED
      ) {
        return {
          status: true,
          message: 'SUCCESS',
          data: null,
        };
      }

      this.logger.error('Failed to send WA msg:', sentMessage);
      return null;
    } catch (error) {
      this.logger.error('WA_MSG_SENT_FAILED:', error);
      return null;
    }
  }

  private createTemplate(params: SendOutboundMsgRequestDTO): any {
    const template = {
      from: {
        phone_number: process.env.FRESHCHAT_SENDER_PHONE_NUMBER,
      },
      provider: 'whatsapp',
      to: [
        {
          phone_number: params.phoneNumber,
        },
      ],
      data: {
        message_template: {
          storage: 'conversation',
          template_name: params.templateName,
          namespace: process.env.FRESHCHAT_NAMESPACE,
          language: {
            policy: process.env.FRESHCHAT_LANG_POLICY,
            code: process.env.FRESHCHAT_LANG,
          },
          rich_template_data: {
            body: {
              params: [
                { data: params.productName },
                { data: params.productId },
                { data: params.pdfLink },
              ],
            },
          },
        },
      },
    };

    return template;
  }

  private async getOutboundMsg(requestId: string): Promise<any> {
    try {
      const url = `${process.env.FRESHCHAT_API_URI}/v2/outbound-messages?request_id=${requestId}`;
      const token = `Bearer ${process.env.FRESHCHAT_API_TOKEN}`;
      const response = await this.httpService.axiosRef.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      });

      return response.status === 200 ? response.data : null;
    } catch (error) {
      this.logger.error('Failed to retrieve outbound message:', error);
      return null;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
