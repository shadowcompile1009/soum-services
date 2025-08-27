import { CheckoutAddress } from './hyperpay';
import axios from 'axios';
import { PaymentCaptureRequest, PaymentItem } from './payment';
import { TransactionStatus } from '../enums/TransactionStatus';

export type TabbyCheckoutRequest = {
  phoneNumber: string;
  email: string;
  name: string;
  orderId: string;
  orderNumber: string;
  paymentId: string;
  userAddress: CheckoutAddress;
  amount: number;
  currency: string;
  paymentType?: string;
  testMode?: string;
  countryCode?: string;
  userId?: string;
  lang: string;
  registerDate: Date;
  items: PaymentItem[];
};

export const prepareCheckoutTabby = async (
  tabbyCheckoutRequest: TabbyCheckoutRequest
) => {
  const checkoutData = {
    payment: {
      amount: tabbyCheckoutRequest.amount,
      currency: tabbyCheckoutRequest.currency,
      buyer: {
        phone: tabbyCheckoutRequest.phoneNumber,
        name: tabbyCheckoutRequest.name,
      },
      order: {
        tax_amount: '0.00',
        shipping_amount: '0.00',
        discount_amount: '0.00',
        reference_id: tabbyCheckoutRequest.orderId,
        items: tabbyCheckoutRequest.items.map(elem => ({
          title: elem.title,
          description: elem.description,
          quantity: 1,
          unit_price: elem.unitPrice,
          reference_id: elem.productId,
          image_url: elem.productImage,
          product_url: elem.productImage,
          category: elem.category,
        })),
      },
      shipping_address: {
        city: tabbyCheckoutRequest.userAddress.city,
        address: tabbyCheckoutRequest.userAddress.address,
        zip: '',
      },
      buyer_history: {
        registered_since: tabbyCheckoutRequest.registerDate,
        loyalty_level: 0,
        wishlist_count: 0,
        is_social_networks_connected: false,
        is_phone_number_verified: true,
        is_email_verified: tabbyCheckoutRequest?.email ? true : false,
      },
      order_history: [] as any[],
      meta: {
        order_id: tabbyCheckoutRequest.orderId,
        customer: tabbyCheckoutRequest.userId,
        order_number: tabbyCheckoutRequest.orderNumber,
        payment_id: tabbyCheckoutRequest.paymentId,
      },
    },
    lang: tabbyCheckoutRequest.lang,
    merchant_code: process.env.MERCHANT_CODE,
    // "merchant_urls": {
    // 	"success": `${env.SOUM_SITE}/payment-successful/${orderId}/${product._id.toString()}/${buyType}`,
    // 	"cancel": `${env.SOUM_SITE}/payment-successful/${orderId}/${product._id.toString()}/${buyType}`,
    // 	"failure": `${env.SOUM_SITE}/payment-successful/${orderId}/${product._id.toString()}/${buyType}`,
    // }
  };
  if (tabbyCheckoutRequest.email) {
    checkoutData.payment.buyer = {
      ...checkoutData.payment.buyer,
      ...{ email: tabbyCheckoutRequest.email },
    };
  }
  return new Promise(resolve => {
    axios
      .post(process.env.TABBY_URL + '/api/v2/checkout', checkoutData, {
        headers: {
          Authorization: 'Bearer ' + process.env.TABBY_TOKEN,
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

export const getPaymentStatusTabby = async (transactionId: string) => {
  return new Promise(resolve => {
    axios
      .get(process.env.TABBY_URL + `/api/v2/payments/${transactionId}`, {
        headers: {
          Authorization: 'Bearer ' + process.env.TABBY_SK,
        },
      })
      .then(function (response) {
        resolve(response?.data);
      })
      .catch(function (error) {
        resolve(error.response.data);
      });
  });
};

export const capturePayment = async (
  tabbyCaptureRequest: PaymentCaptureRequest
) => {
  const captureData = {
    amount: tabbyCaptureRequest.amount,
    created_at: new Date(),
    items: tabbyCaptureRequest.items.map(elem => ({
      title: elem.title,
      description: elem.description,
      quantity: 1,
      unit_price: elem.unitPrice,
      reference_id: elem.productId,
      image_url: elem.productImage,
      product_url: elem.productImage,
      category: elem.category,
    })),
  };

  return new Promise(resolve => {
    axios
      .post(
        process.env.TABBY_URL +
          `/api/v2/payments/${tabbyCaptureRequest.paymentId}/captures`,
        captureData,
        {
          headers: {
            Authorization: 'Bearer ' + process.env.TABBY_SK,
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

export const closeTabbyOrder = async (transactionId: string) => {
  return new Promise(resolve => {
    axios
      .post(
        process.env.TABBY_URL + `/api/v1/payments/${transactionId}/close`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + process.env.TABBY_SK,
          },
        }
      )
      .then(function (response) {
        resolve(response?.data);
      })
      .catch(function (error) {
        resolve(error?.response?.data);
      });
  });
};

export const checkPaymentStatus = (resultData: any) => {
  if (resultData.status == 'CLOSED') return TransactionStatus.COMPLETED;
  else if (resultData.status == 'AUTHORIZED')
    return TransactionStatus.AUTHORISED;
  return TransactionStatus.FAILED;
};

export const checkPaymentCheckoutStatus = (resultData: any) => {
  if (resultData.status == 'created' || resultData.status == 'approved')
    return 'Success';
  return 'Fail';
};
