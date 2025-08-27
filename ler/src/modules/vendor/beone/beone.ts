import { BeOneOrderStatus } from "@src/enum/beOne.enum";
import { CreatePickupForAccessoriesRequest, CreatePickupRequest, CreatePickupResponse } from "@src/modules/grpc/proto/ler.pb";
import axios from 'axios';

export class BeOne {
  private static accountNo = process.env.BEONE_ACCOUNT_NO;
  private static secretKey = process.env.BEONE_SECRET_KET;
  private static baseUrl = process.env.BEONE_BASE_URL;
  private static baseUrlForFulfilment = process.env.BEONE_FULFILMENT_BASE_URL;
  private static soumEmail = process.env.BEONE_SOUM_EMAIL;

  public static async createOrder(
    beOneOrderDocument: CreatePickupRequest
  ): Promise<CreatePickupResponse> {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${BeOne.baseUrl}/API/orderCreate`,
          {
            "account_no": BeOne.accountNo,
            "secret_key": BeOne.secretKey,
            "payment_mode": "CC",
            "reference_no": beOneOrderDocument.referenceNo,
            "origin_city": beOneOrderDocument.originCity,
            "destination_city": beOneOrderDocument.destinationCity,
            "pieces": 1,
            "weight": 1,
            "productType": "parcel",
            "sender_name": beOneOrderDocument.senderName,
            "sender_address": beOneOrderDocument.senderAddress,
            "sender_phone": beOneOrderDocument.senderPhone,
            "sender_email": BeOne.soumEmail,
            "receiver_name": beOneOrderDocument.receiverName,
            "receiver_address": beOneOrderDocument.receiverAddress,
            "receiver_phone": beOneOrderDocument.receiverPhone,
            "receiver_email": BeOne.soumEmail,
            "description": beOneOrderDocument.description,
          },
        )
        .then(function (response) {
          if (response?.data?.awb_no) {
            resolve( {awbNo: response?.data?.awb_no } );
          } else {
            reject(response);
          }
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public static async CreatePickUpForAccessories(
    beOneOrderDocument: CreatePickupForAccessoriesRequest
  ): Promise<CreatePickupResponse> {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${BeOne.baseUrlForFulfilment}/API/createOrder`,
          {
            "account_no": BeOne.accountNo,
            "secret_key": BeOne.secretKey,
            "payment_mode": "CC",
            "cod_amount": 0,
            "reference_id": beOneOrderDocument.referenceNo,
            "origin_city": beOneOrderDocument.originCity,
            "destination_city": beOneOrderDocument.destinationCity,
            "sender_name": beOneOrderDocument.senderName,
            "sender_address": beOneOrderDocument.senderAddress,
            "sender_phone": beOneOrderDocument.senderPhone,
            "sender_email": BeOne.soumEmail,
            "receiver_name": beOneOrderDocument.receiverName,
            "receiver_address": beOneOrderDocument.receiverAddress,
            "receiver_phone": beOneOrderDocument.receiverPhone,
            "receiver_email": BeOne.soumEmail,
            "skudetails": beOneOrderDocument.skudetails
          },
        )
        .then(function (response) {
          if (response?.data?.awb_no) {
            resolve( {awbNo: response?.data?.awb_no } );
          } else {
            reject(response);
          }
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public static async getOrderStatus(
    awbNo: string,
    isDelivered: boolean = false
  ): Promise<BeOneOrderStatus> {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${BeOne.baseUrl}/TrackOrderAPI/OrderTrackAPI`,
          {
            "account_no": BeOne.accountNo,
            "secret_key": BeOne.secretKey,
            "orderNo": awbNo
          },
        )
        .then(function (response) {
          let orderStatus = null;
          if (response?.data?.errorCode == 0) {
            if (response?.data?.data?.length) {
              orderStatus = BeOne.matchOrderStatus(isDelivered, response?.data?.data);
            }
          }
          resolve(orderStatus);
        })
        .catch(function (error) {
          resolve(null);
        });
    });
  }

  private static matchOrderStatus(isDelivered: boolean, responseData: any[]): string {
    const inTransitOrdersStatusesInBeOne = new Set([
      BeOneOrderStatus.PICKED_UP_COMPLETED,
      BeOneOrderStatus.SHELVED,
      BeOneOrderStatus.RECEIVED_AT_WAREHOUSE,
      BeOneOrderStatus.READY_TO_DISPATCH,
      BeOneOrderStatus.OFD_DISPATCHED,
      BeOneOrderStatus.IN_TRANSIT,
      BeOneOrderStatus.RESCHEDULED_FOR_NEXT_DAY
    ]);
    let orderStatus = null;
    for (const item of responseData) {
      if (isDelivered) {
        if (item.Order_status === BeOneOrderStatus.ITEM_DELIVERED) {
          orderStatus = item.Order_status;
          break;
        }
      } else if (inTransitOrdersStatusesInBeOne.has(item.Order_status) ) {
        orderStatus = item.Order_status;
        break;
      }
    }
    return orderStatus;
  }

}
