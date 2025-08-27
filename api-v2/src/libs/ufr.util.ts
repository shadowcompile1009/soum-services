import logger from '../util/logger';
import axios, { AxiosRequestConfig } from 'axios';

export enum UFRLabelType {
  WILL_FULLFILL = 'WILL_FULFILL',
  WILL_NOT_FULFILL = 'WILL_NOT_FULFILL',
  MAY_BE = 'Maybe',
}

export class UFR {
  private static baseUrl = process.env.UFR_BASE_URL;
  public static async getProductUFRLabelById(
    productId: string
  ): Promise<string> {
    const data: any = { product_id: productId };
    const axiosConf: AxiosRequestConfig = {
      method: 'post',
      url: `${this.baseUrl}/ufr-model`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer $(gcloud auth print-identity-token)`,
      },
      data,
    };
    return axios(axiosConf)
      .then((response: any) => {
        if (response?.data?.prediction_label) {
          return response?.data?.prediction_label;
        }
        return '';
      })
      .catch(exception => {
        logger.error(exception);
        return '';
      });
  }

  public static async getProductViewslById(productId: string): Promise<string> {
    const data: any = { product_id: productId };
    const axiosConf: AxiosRequestConfig = {
      method: 'post',
      url: `${this.baseUrl}/product-views-webengage`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer $(gcloud auth print-identity-token)`,
      },
      data,
    };
    return axios(axiosConf)
      .then((response: any) => {
        if (response?.data?.product_views) {
          return response?.data?.product_views;
        }
        return 0;
      })
      .catch(exception => {
        logger.error(exception);
        return 0;
      });
  }
}
