import axios from 'axios';

export class WebEngage {
  private static baseUrl = process.env.WE_BASE_URL;
  private static apiKey = process.env.WE_API_KEY;
  private static licenseCode = process.env.WE_LICENSE_CODE;
  private static campaignId = process.env.WE_CAMPAIGN_ID;

  public static sendWETransactionalCampaignMessage(
    userId: string,
    overrideData?: any, // type any is used as any number of parameters can be passed here
  ): Promise<any> {
    const transactionalCampaignApiUrl = `${WebEngage.baseUrl}/v2/accounts/in${WebEngage.licenseCode}/experiments/${WebEngage.campaignId}/transaction`;
    const body = {
      userId,
      ttl: 30,
      overrideData: {
        context: {
          token: overrideData,
        },
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post(transactionalCampaignApiUrl, body, {
          headers: {
            Authorization: 'Bearer ' + WebEngage.apiKey,
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    });
  }

  public static sendEventData(data: {
    userId: string;
    eventName: string;
    eventTime: string;
    eventData: any;
  }) {
    const url = `${WebEngage.baseUrl}/v1/accounts/in${WebEngage.licenseCode}/events`;
    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {
            userId: data.userId,
            eventName: data.eventName,
            eventTime: data.eventTime.toString(),
            eventData: data.eventData,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${WebEngage.apiKey}`,
            },
          },
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
