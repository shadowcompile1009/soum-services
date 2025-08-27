import { IncomingWebhook } from '@slack/webhook';
import logger from '../util/logger';

export class SlackUtil {
  public static emitSlackMessageAlert(payload: string) {
    const url = process.env.SLACK_WEBHOOK_URL;
    SlackUtil.sendSlackNotification(url, {
      text: payload,
    });
  }

  static logErrorMessage(message: string, error: Error) {
    const url = process.env.SLACK_WEBHOOK_URL;
    let errorMessage = 'Something went wrong';
    if (error && error.message) {
      errorMessage = error.message;
    }
    const errorBlock = {
      blocks: [
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                {
                  type: 'text',
                  text: message,
                },
              ],
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                {
                  type: 'text',
                  text: 'Error detail: ',
                  style: {
                    bold: true,
                  },
                },
                {
                  type: 'text',
                  text: errorMessage,
                },
              ],
            },
          ],
        },
      ],
    };
    SlackUtil.sendSlackNotification(url, errorBlock);
  }

  private static sendSlackNotification(url: string, payload: any) {
    const webhook = new IncomingWebhook(url);

    // Send the notification
    (async () => {
      try {
        await webhook.send(payload);
      } catch (error) {
        logger.error(`Fail to send notification to slack ${error}`);
      }
    })();
  }
}
