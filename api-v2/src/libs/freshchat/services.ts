import config from 'config';
import request from 'request';
import logger from '../../util/logger';
import axios from 'axios';
import FreshchatMessageStatus from './freshchatMessageStatus.Enum';

const freshChatConfig: { [key: string]: string } = config.get('freshchat');
const path = '/v2/outbound-messages/whatsapp';

export async function getOutboundMsg(requestId: string): Promise<any> {
  const path = `/v2/outbound-messages?request_id=${requestId}`;
  const token = 'Bearer ' + freshChatConfig.token;

  const options = {
    method: 'GET',
    url: freshChatConfig.api_uri + path,
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (!error) {
        logger.info('Successfully get outbound msg via Freshchat');
        const splitData = JSON.parse(body);
        if (response.statusCode == 200) {
          resolve(splitData);
        } else {
          resolve(null);
        }
      } else {
        logger.error(`Fail to get outbound msg via Freshchat ${error}`);
        reject(null);
      }
    });
  });
}

export const sendOutboundMessage = async (template: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sendOutboundMessageRequest = await axios.post(
        freshChatConfig.api_uri + path,
        template,
        {
          headers: {
            Authorization: `Bearer ` + freshChatConfig.token,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!sendOutboundMessageRequest.data.request_id) {
        resolve(null);
      }
      const outboundMessages = await getOutboundMsg(
        sendOutboundMessageRequest.data.request_id
      );
      if (
        outboundMessages?.outbound_messages &&
        outboundMessages?.outbound_messages.length &&
        outboundMessages?.outbound_messages[0].status !==
          FreshchatMessageStatus.FAILED
      ) {
        resolve(outboundMessages?.outbound_messages[0]);
      } else {
        reject(null);
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
