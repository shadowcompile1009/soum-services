import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OrderData, SmsaOrderDTO } from './dto/smsa.dto';

// axios.interceptors.request.use((request) => {
//   console.log('------------ Starting Request-------------');
//   console.log(JSON.stringify(request, null, 2));
//   return request;
// });

@Injectable()
export class SmsaService {
  private readonly logger = new Logger(SmsaService.name);
  private baseUrl = `${process.env.SMSA_API_BASE_URL}`;
  private passKey = process.env.SMSA_PASS_KEY;
  private readonly httpService = new HttpService();

  generateOrderContent(orderData: OrderData): SmsaOrderDTO {
    let buyerName = orderData?.buyerName || process.env.SMSA_BUYER_NAME;
    if (buyerName?.length < 3) {
      buyerName = `${buyerName} ${process.env.SMSA_BUYER_NAME}`;
    }

    let sellerName = orderData?.sellerName || process.env.SOUM_SELLER_NAME;
    if (sellerName?.length < 3) {
      sellerName = `${sellerName} ${process.env.SOUM_SELLER_NAME}`;
    }

    return {
      passkey: this.passKey,
      refno: orderData.orderNumber as string,
      sentDate: new Date().toJSON(),
      idNo: orderData.orderId,
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

  async createOrder(orderData: OrderData): Promise<string> {
    try {
      const data: SmsaOrderDTO = this.generateOrderContent(orderData);
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/SecomRestWebApi/api/addShip`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response?.data.includes(' ')) {
        const splitArr = response?.data?.split(' ');
        if (splitArr.length > 1) {
          return splitArr.pop();
        }
      }
      return response?.data || null;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async trackOrder(trackingId: string): Promise<{ result: any }> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/getTracking?awbNo=${trackingId}&passkey=${this.passKey}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response?.data?.Tracking?.length) {
        for (const item of response.data.Tracking) {
          if (item.awbNo === trackingId) {
            return {
              result: { status: item.Activity, trackingNo: item.awbNo },
            };
          }
        }
      }
      return { result: null };
    } catch (error) {
      this.logger.error(error);
      return { result: null };
    }
  }
}
