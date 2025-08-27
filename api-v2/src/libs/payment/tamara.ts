import axios from 'axios';
import { CheckoutRequest, CancelRequest } from './index';
import { TransactionStatus } from '../../enums/TransactionStatus';
import { ReturnURL } from '../../dto/product/PurchaseProductDto';

export enum TamaraPaymentStatus {
  APPROVED = 'approved',
  AUTHORIZED = 'authorised',
  FULLY_CAPTURED = 'fully_captured',
}
export type TamaraCheckoutRequest = CheckoutRequest & {
  returnUrls: ReturnURL[];
};
export type TamaraCancelRequest = CancelRequest;

export const getPaymentInformationFromTamara = async (
  tamaraOrderId: string
) => {
  return new Promise(resolve => {
    axios
      .get(process.env.TAMARA_BASE_URL + '/orders/' + tamaraOrderId, {
        headers: {
          Authorization: 'Bearer ' + process.env.TAMARA_API_TOKEN,
        },
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        resolve(error.response.data);
      });
  });
};

export const cancelOrderFromTamara = async (
  cancelPaymentRequest: TamaraCancelRequest
) => {
  const bodyData = {
    total_amount: {
      amount: cancelPaymentRequest.amount,
      currency: cancelPaymentRequest.currency,
    },
    shipping_amount: { amount: 0, currency: cancelPaymentRequest.currency },
    tax_amount: { amount: 0, currency: cancelPaymentRequest.currency },
    discount_amount: { amount: 0, currency: cancelPaymentRequest.currency },
    items: cancelPaymentRequest.items.map(elem => ({
      name: elem.title,
      quantity: 1,
      reference_id: elem.productId,
      sku: 'string',
      image_url: elem.productImage,
      discount_amount: {
        amount: 0,
        currency: cancelPaymentRequest.currency,
      },
      tax_amount: {
        amount: 0,
        currency: cancelPaymentRequest.currency,
      },
      total_amount: {
        amount: elem.unitPrice,
        currency: cancelPaymentRequest.currency,
      },
      unit_price: {
        amount: elem.unitPrice,
        currency: cancelPaymentRequest.currency,
      },
      type: elem.category,
    })),
  };
  return new Promise(resolve => {
    axios
      .post(
        process.env.TAMARA_BASE_URL +
          '/orders/' +
          cancelPaymentRequest.paymentId +
          '/cancel',
        bodyData,
        {
          headers: {
            Authorization: 'Bearer ' + process.env.TAMARA_API_TOKEN,
          },
        }
      )
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        resolve(error.response.data);
      });
  });
};

export const authorizeTamaraPayment = async (tamaraOrderId: string) => {
  return new Promise(resolve => {
    axios
      .post(
        process.env.TAMARA_BASE_URL + '/orders/' + tamaraOrderId + '/authorise',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + process.env.TAMARA_API_TOKEN,
          },
        }
      )
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        resolve(error.response.data);
      });
  });
};

export const captureTamaraOrder = async (
  paymentCaptureRequest: TamaraCheckoutRequest
) => {
  const captureData = {
    order_id: paymentCaptureRequest.paymentId,
    total_amount: {
      amount: paymentCaptureRequest.items.reduce(
        (partialSum, elem) => partialSum + elem.unitPrice,
        0
      ),
      currency: paymentCaptureRequest.currency,
    },
    items: paymentCaptureRequest.items.map(elem => ({
      reference_id: elem.productId,
      type: elem.category,
      name: elem.title,
      sku: 'string',
      image_url: elem.productImage,
      quantity: 1,
      tax_amount: {
        amount: 0,
        currency: paymentCaptureRequest.currency,
      },
      total_amount: {
        amount: elem.unitPrice,
        currency: paymentCaptureRequest.currency,
      },
      unit_price: {
        amount: elem.unitPrice,
        currency: paymentCaptureRequest.currency,
      },
      discount_amount: {
        amount: 0,
        currency: paymentCaptureRequest.currency,
      },
    })),
    shipping_info: {
      shipped_at: new Date(),
      shipping_company: 'Soum',
    },
  };
  return new Promise(resolve => {
    axios
      .post(process.env.TAMARA_BASE_URL + '/payments/capture', captureData, {
        headers: {
          Authorization: 'Bearer ' + process.env.TAMARA_API_TOKEN,
        },
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        resolve(error.response.data);
      });
  });
};

export const checkPaymentCheckoutStatusTamara = (resultData: any) => {
  if (resultData.checkout_id) return TransactionStatus.COMPLETED;
  return TransactionStatus.FAILED;
};

export const checkPaymentStatusTamara = (resultData: any) => {
  if (resultData.status === TamaraPaymentStatus.FULLY_CAPTURED) {
    return TransactionStatus.COMPLETED;
  } else if (resultData.status === TamaraPaymentStatus.AUTHORIZED) {
    return TransactionStatus.AUTHORISED;
  } else {
    return TransactionStatus.FAILED;
  }
};
