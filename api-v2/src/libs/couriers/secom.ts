import axios, { AxiosRequestConfig } from 'axios';
import { logger } from '@sentry/utils';
import { OrderData } from '../../models/DeltaMachineOrder';
export type SecomType = {
  link: string;
  passKey: string;
};

export type SecomShip = {
  passkey: string;
  refno: string;
  sentDate: string;
  idNo: string;
  cName: string;
  cntry: string;
  cCity: string;
  cZip: string;
  cPOBox: string;
  cMobile: string;
  cTel1: string;
  cTel2: string;
  cAddr1: string;
  cAddr2: string;
  shipType: string;
  PCs: string;
  cEmail: string;
  carrValue: string;
  carrCurr: string;
  codAmt: string;
  weight: string;
  itemDesc: string;
  custVal: string;
  custCurr: string;
  insrAmt: string;
  insrCurr: string;
  sName: string;
  sContact: string;
  sAddr1: string;
  sAddr2: string;
  sCity: string;
  sPhone: string;
  sCntry: string;
  prefDelvDate: string;
  gpsPoints: string;
};

export class Secom {
  private static baseUrl = process.env.SECOM_API_BASE_URL;
  private static passKey = process.env.SECOM_PASS_KEY;
  private static generateOrderContent(
    orderId: string,
    orderData: OrderData
  ): SecomShip {
    let buyerName = orderData?.buyerName;
    let sellerName = orderData?.sellerName;
    if (!buyerName) {
      buyerName = process.env.DEFAULT_SMSA_BUYER_NAME;
    } else if (buyerName?.length < 3) {
      buyerName = `${buyerName} ${process.env.DEFAULT_SMSA_BUYER_NAME}`;
    }
    if (!sellerName) {
      sellerName = process.env.DEFAULT_SMSA_SELLER_NAME;
    } else if (sellerName?.length < 3) {
      sellerName = `${sellerName} ${process.env.DEFAULT_SMSA_SELLER_NAME}`;
    }
    return {
      passkey: Secom.passKey,
      refno: orderData.orderNumber as string,
      sentDate: new Date().toJSON(),
      idNo: orderId,
      cName: buyerName,
      cntry: 'Saudi Arabia',
      cCity: orderData.buyerCity,
      cZip: orderData.buyerPostalCode,
      cPOBox: '234',
      cMobile: orderData.buyerPhone,
      cAddr1: orderData.buyerAddress || '',
      shipType: 'DLV',
      PCs: '1',
      cEmail: '',
      carrValue: '',
      carrCurr: 'SAR',
      weight: '1',
      itemDesc: orderData.productName,
      custVal: '',
      custCurr: 'SAR',
      insrAmt: '0',
      insrCurr: 'SAR',
      sName: sellerName,
      sContact: orderData.sellerPhone,
      sAddr1: orderData.sellerAddress,
      sCity: orderData.sellerCity,
      sPhone: orderData.sellerPhone,
      sCntry: 'Saudi Arabia',
      prefDelvDate: '',
      cTel1: '',
      codAmt: '',
      sAddr2: '',
      gpsPoints: '',
      cTel2: '',
      cAddr2: '',
    };
  }

  public static createOrder(
    orderId: string,
    orderData: OrderData
  ): Promise<{ error: boolean; result: any }> {
    const data: SecomShip = Secom.generateOrderContent(orderId, orderData);
    const axiosConf: AxiosRequestConfig = {
      method: 'post',
      url: `${Secom.baseUrl}/addShip`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    return axios(axiosConf)
      .then(response => {
        return { error: false, result: response.data };
      })
      .catch(exception => {
        logger.error(exception);
        return { error: true, result: 'Create Ship is unsuccessful' };
      });
  }

  static trackOrder(
    trackingId: string
  ): Promise<{ error: boolean; result: any }> {
    const axiosConf: AxiosRequestConfig = {
      method: 'get',
      url: `${Secom.baseUrl}/getTracking?awbNo=${trackingId}&passkey=${Secom.passKey}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return axios(axiosConf)
      .then(response => {
        if (response?.data?.Tracking?.length) {
          for (const item of response.data.Tracking) {
            if (item.awbNo === trackingId) {
              return {
                error: false,
                result: { status: item.Activity, trackingNo: item.awbNo },
              };
            }
          }
        }
        return { error: true, result: 'Order tracking is unsuccessful' };
      })
      .catch(exception => {
        return { error: true, result: exception };
      });
  }
}
