import config from 'config';
import https from 'https';
import querystring from 'querystring';
import request from 'request';
import logger from '../util/logger';
import { Constants } from '../constants/constant';
import { decrypt, decryptIBAN, _get } from '../util/common';
import { RefundMethod } from '../enums/RefundMethod';
import { TransactionStatus } from '../enums/TransactionStatus';
import { PaymentProviderType } from '../models/Payment';
import { isValidIBAN } from 'ibantools';

const hyperConfig: { [key: string]: string } = config.get('hyperpay');

const showConfig = () => {
  return hyperConfig;
};

export type CheckoutAddress = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  givenName: string;
  surName: string;
};

export type CheckoutRequest = {
  cardType: string;
  cardIds?: string[];
  amount: number;
  currency: string;
  paymentType?: string;
  userAddress: CheckoutAddress;
  testMode?: string;
  countryCode?: string;
  phoneNumber?: string;
  paymentNumber?: string;
};

export type PayoutSellerRequest = {
  orderNumber: string;
  seller: any;
  sellerAmount: string;
  accessToken: string;
  address?: any;
  isNonSaudiBank?: boolean;
};

export type PayoutBuyerRequest = {
  orderNumber: string;
  buyer: any;
  buyerAmount: string;
  accessToken: string;
  address?: any;
  isNonSaudiBank?: boolean;
};

export const getEntityId = (cardType: string) => {
  let returnedId = '';
  switch (cardType) {
    case Constants.cardType.Mada:
      returnedId = hyperConfig.mada_entity_id;
      break;
    case Constants.cardType.ApplePay:
      returnedId = hyperConfig.apple_entity_id;
      break;
    case Constants.cardType.StcPay:
      returnedId = hyperConfig.stc_entity_id;
      break;
    case Constants.cardType.UrPay:
      returnedId = hyperConfig.ur_pay_entity_id;
    case Constants.cardType.VisaMaster:
      returnedId = hyperConfig.visa_entity_id;
      break;
  }
  return returnedId;
};

export const prepareCheckout = async (req: CheckoutRequest) => {
  const path = '/v1/checkouts';
  const entityId = getEntityId(req.cardType);
  if (!entityId) {
    return false;
  }

  const data: { [key: string]: any } = {
    entityId,
    merchantTransactionId: req.paymentNumber,
    amount: req.amount,
    currency: req.currency,
    paymentType: req.paymentType || 'DB',
    'billing.street1': req.userAddress.address,
    'billing.city': req.userAddress.city,
    'billing.state': req.userAddress.state,
    'billing.country': req.userAddress.country,
    'billing.postcode': req.userAddress.postalCode,
    'customer.givenName': req.userAddress.givenName,
    'customer.surname': req.userAddress.surName,
  };

  if (
    [Constants.cardType.Mada, Constants.cardType.VisaMaster].includes(
      req.cardType
    )
  ) {
    data.createRegistration = true;
    data['customer.mobile'] = '+' + req.countryCode + req.phoneNumber;
    req.cardIds?.forEach((cardId: string, index: number) => {
      data[`registrations[${index}].id`] = cardId;
    });

    if (
      (process.env.NODE_ENV == 'development' ||
        process.env.NODE_ENV == 'staging') &&
      (req.cardType == Constants.cardType.VisaMaster ||
        req.cardType == Constants.cardType.Mada)
    ) {
      Object.assign(data, {
        'customParameters["3DS2_enrolled"]': true,
      });
    }
  }

  const requestData = querystring.stringify(data);
  const options = {
    port: 443,
    host: hyperConfig.pay_url,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': requestData.length,
      Authorization: hyperConfig.pay_auth_key,
    },
  };

  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf: Uint8Array[] | Buffer[] = [];
      res.on('data', chunk => {
        buf.push(Buffer.from(chunk));
      });
      res.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8');
        try {
          resolve(JSON.parse(jsonString));
        } catch (error) {
          reject(error);
        }
      });
    });
    postRequest.on('error', reject);
    postRequest.write(requestData);
    postRequest.end();
  });
};

export const getPaymentStatus = async (
  paymentUrl: string,
  cardType: string
) => {
  const entityId = getEntityId(cardType);
  let path = paymentUrl;
  path += `?entityId=${entityId}`;
  const options = {
    port: 443,
    host: hyperConfig.pay_url,
    path: path,
    method: 'GET',
    headers: {
      Authorization: hyperConfig.pay_auth_key,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf: Uint8Array[] | Buffer[] = [];
      res.on('data', chunk => {
        buf.push(Buffer.from(chunk));
      });
      res.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8');
        try {
          resolve(JSON.parse(jsonString));
        } catch (error) {
          reject(error);
        }
      });
    });
    postRequest.on('error', reject);
    postRequest.end();
  });
};
export async function loginHyperSplits(): Promise<{
  token: string;
  message: string;
}> {
  const options = {
    method: 'POST',
    url: hyperConfig.pay_split_url + '/api/v1/login',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: hyperConfig.pay_split_email,
      password: hyperConfig.pay_split_pass,
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        logger.error(`Fail to login HyperSplits. ${error}`);
        reject({ token: null, message: error });
      } else {
        logger.info('Successfully to login HyperSplits');
        logger.info(body);
        const logData = JSON.parse(body);
        if (response.statusCode == 200 && logData.status == true) {
          const token = logData.data.accessToken;
          resolve({ token, message: 'Successfully to login HyperSplits' });
        } else {
          resolve({ token: null, message: 'Fail to login HyperSplits' });
        }
      }
    });
  });
}
export function getDecodeBankAndBICFunc(
  userType: string,
  payoutRequest: PayoutSellerRequest | PayoutBuyerRequest
) {
  const bankBIC =
    userType === 'seller'
      ? decrypt(
          _get(payoutRequest, 'seller.bankDetail.bankBIC', ''),
          _get(payoutRequest, 'seller.secretKey', '')
        )
      : decrypt(
          _get(payoutRequest, 'buyer.bankDetail.bankBIC', ''),
          _get(payoutRequest, 'buyer.secretKey', '')
        );
  const accountId =
    userType === 'seller'
      ? decryptIBAN(
          _get(payoutRequest, 'seller.bankDetail.accountId', ''),
          _get(payoutRequest, 'seller.secretKey', '')
        )
      : decryptIBAN(
          _get(payoutRequest, 'buyer.bankDetail.accountId', ''),
          _get(payoutRequest, 'buyer.secretKey', '')
        );
  return {
    bankBIC,
    accountId,
  };
}

export async function createPayoutOrder(
  payoutRequest: PayoutSellerRequest | PayoutBuyerRequest,
  userType: string = 'seller',
  currency: string
): Promise<[boolean, { splitData: any; message?: string }]> {
  const { bankBIC, accountId } = getDecodeBankAndBICFunc(
    userType,
    payoutRequest
  );
  if (!isValidIBAN(accountId)) {
    return [true, { splitData: { errors: 'Invalid IBAN' } }];
  }
  const path = '/api/v1/orders';
  const token = 'Bearer ' + payoutRequest.accessToken;
  const beneficiary = [
    {
      name:
        userType === 'seller'
          ? _get(payoutRequest, 'seller.bankDetail.accountHolderName', 'N/A')
          : _get(payoutRequest, 'buyer.bankDetail.accountHolderName', 'N/A'),
      accountId: accountId,
      debitCurrency: currency,
      transferAmount:
        userType === 'seller'
          ? _get(payoutRequest, 'sellerAmount', 0)
          : _get(payoutRequest, 'buyerAmount', 0),
      transferCurrency: currency,
      bankIdBIC: bankBIC,
      payoutBeneficiaryAddress1: _get(payoutRequest, 'address.district', 'N/A'),
      payoutBeneficiaryAddress2: _get(payoutRequest, 'address.city', 'N/A'),
      payoutBeneficiaryAddress3: _get(
        payoutRequest,
        'address.postal_code',
        'N/A'
      ),
      swift: !payoutRequest?.isNonSaudiBank ? 0 : 1,
    },
  ];

  if (bankBIC == 'INMASARI') {
    beneficiary[0].accountId = beneficiary[0].accountId.substring(10);
    delete beneficiary[0].bankIdBIC;
  }

  const options = {
    method: 'POST',
    url: hyperConfig.pay_split_url + path,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      configId: hyperConfig.pay_split_config_id,
      merchantTransactionId: _get(payoutRequest, 'orderNumber', 'N/A'),
      transferOption: '0',
      // batchDescription: generateRandomOperationNumber('payout'),
      beneficiary,
    }),
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (!error) {
        logger.info('Successfully create order via HyperSplits');
        logger.info(body);
        const splitData = JSON.parse(body);
        if (response.statusCode == 200 && splitData.status == true) {
          resolve([false, { splitData }]);
        } else {
          resolve([true, { splitData }]);
        }
      } else {
        logger.error(`Fail to create order to HyperSplits. ${error}`);
        reject([true, { splitData: null, message: error.message }]);
      }
    });
  });
}

export async function getSpecificOrder(
  accountId: string,
  uniqueId: string,
  accessToken: string
): Promise<[boolean, { splitData: any; message?: string }]> {
  const path = `/api/v1/orders/${accountId}/${uniqueId}`;
  const token = 'Bearer ' + accessToken;

  const options = {
    method: 'GET',
    url: hyperConfig.pay_split_url + path,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    },
    timeout: 2000,
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (!error) {
        logger.info('Successfully get specific order via HyperSplits');
        logger.info(body);
        try {
          const splitData = JSON.parse(body);
          if (response.statusCode == 200 && splitData.status == true) {
            resolve([false, { splitData }]);
          } else {
            resolve([true, { splitData }]);
          }
        } catch (exception) {
          logger.error(
            `Fail to parse JSON body in get specific order to HyperSplits. ${exception}`
          );
          reject([true, { splitDate: null, message: exception.message }]);
        }
      } else {
        logger.error(`Fail to get specific order to HyperSplits. ${error}`);
        reject([true, { splitDate: null, message: error.message }]);
      }
    });
  });
}

export async function getSpecificPayout(
  hyperSplitId: string,
  accessToken: string
): Promise<[boolean, { splitData: any; message?: string }]> {
  const path = `/api/v1/payouts/${hyperSplitId}`;
  const token = 'Bearer ' + accessToken;

  const options = {
    method: 'GET',
    url: hyperConfig.pay_split_url + path,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    },
    timeout: 2000,
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (!error) {
        logger.info('Successfully get specific payout via HyperSplits');
        logger.info(body);
        const splitData = JSON.parse(body);
        if (response.statusCode == 200 && splitData.status == true) {
          resolve([false, { splitData }]);
        } else {
          resolve([true, { splitData }]);
        }
      } else {
        logger.error(`Fail to get specific payout to HyperSplits. ${error}`);
        reject([true, { splitDate: null, message: error.message }]);
      }
    });
  });
}

export const checkPaymentStatusCode = (resultData: any) => {
  const transactionCode = resultData?.code || '';
  const success = /^(000\.000\.|000\.100\.1|000\.[36])/;
  const pending = /^(000\.200)/;

  const sucStatus = success.test(transactionCode);
  const pendingStatus = pending.test(transactionCode);

  if (sucStatus) {
    return 'Success';
  } else if (pendingStatus) {
    return 'Pending';
  } else {
    return 'Fail';
  }
};

export const mapToRefundStatus = (strStatus: string) => {
  if (strStatus === 'Success') {
    return TransactionStatus.COMPLETED;
  } else if (strStatus === 'Pending') {
    return TransactionStatus.PENDING;
  } else {
    return TransactionStatus.FAILED;
  }
};
export const getPaymentStatusFromReporting = async (
  orderNumber: string,
  paymentProviderType: PaymentProviderType
) => {
  const entityId = getEntityId(paymentProviderType);
  let path = '/v1/query';
  path += '?entityId=' + entityId;
  path += '&merchantTransactionId=' + orderNumber;

  const options = {
    port: 443,
    host: hyperConfig.pay_url,
    path: path,
    method: 'GET',
    headers: {
      Authorization: hyperConfig.pay_auth_key,
    },
  };

  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf: any = [];
      res.on('data', chunk => {
        buf.push(Buffer.from(chunk));
      });
      res.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8');
        try {
          logger.info('Successfully get payment status via Reporting HyperPay');
          resolve(JSON.parse(jsonString));
        } catch (error) {
          logger.error(
            `Fail to get payment status via Reporting HyperPay. ${error}`
          );
          reject(error);
        }
      });
    });
    postRequest.on('error', reject);
    postRequest.end();
  });
};

export const getPaymentStatusFromCheckout = async (
  checkoutId: string,
  paymentProviderType: PaymentProviderType
) => {
  const entityId = getEntityId(paymentProviderType);
  let path = `/v1/checkouts/${checkoutId}/payment`;
  path += '?entityId=' + entityId;
  const options = {
    port: 443,
    host: hyperConfig.pay_url,
    path: path,
    method: 'GET',
    headers: {
      Authorization: hyperConfig.pay_auth_key,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf: any = [];
      res.on('data', chunk => {
        buf.push(Buffer.from(chunk));
      });
      res.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8');
        try {
          logger.info('Successfully get payment status via checkout HyperPay');
          resolve(JSON.parse(jsonString));
        } catch (error) {
          logger.error(
            `Fail to get payment status via checkout HyperPay. ${error}`
          );
          reject(error);
        }
      });
    });
    postRequest.on('error', reject);
    postRequest.end();
  });
};
export const testCreateOrderHyperSplits = async (accessToken: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://splits.sandbox.hyperpay.com/api/v1/orders',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // eslint-disable-next-line max-len
        Authorization: 'Bearer ' + accessToken,
      },
      // eslint-disable-next-line max-len
      body: '{  "merchantTransactionId": "asdfg4194189196",  "transferOption": "0",  "configId": "1c11327d420b0590da0a9b961516c7cb",  "beneficiary": [    {      "name": "Bader",      "accountId": "68200019878000",      "debitCurrency": "SAR",      "transferAmount": "55.55",      "transferCurrency": "SAR",      "payoutBeneficiaryAddress1": "Jordan-Amman",      "payoutBeneficiaryAddress2": "Jordan-Amman",      "payoutBeneficiaryAddress3": "Jordan-Amman"    } ]}',
    };
    request(options, function (error, response, body) {
      if (!error) {
        logger.info('Create order on HyperSplit successfully');
        logger.info(body);
        const splitData = JSON.parse(body);
        if (response.statusCode == 200 && splitData.status == true) {
          resolve(splitData);
        } else {
          resolve(false);
        }
      } else {
        logger.error(`Fail to create order with HyperSplits. ${error}`);
        reject(false);
      }
    });
  });
};
export const refundPayment = async (
  transactionId: string,
  cardType: string,
  amount: number,
  refundMethod: RefundMethod
) => {
  const entityId = getEntityId(cardType);
  const env = process.env.NODE_ENV;
  let data = {} as any;
  const path = '/v1/payments/' + transactionId;
  if (refundMethod == RefundMethod.refund) {
    data = {
      entityId: entityId,
      amount: amount,
      currency: 'SAR',
      paymentType: 'RF',
    };
  } else if (refundMethod == RefundMethod.reversal) {
    data = {
      entityId: entityId,
      paymentType: 'RV',
    };
  }
  if ((env == 'development' || env == 'staging') && cardType == 'VISA_MASTER')
    data.testMode = 'EXTERNAL';

  const requestData = querystring.stringify(data);

  const options = {
    port: 443,
    host: hyperConfig.pay_url,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': requestData.length,
      Authorization: hyperConfig.pay_auth_key,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf: any = [];
      res.on('data', chunk => {
        buf.push(Buffer.from(chunk));
      });
      res.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8');
        try {
          logger.info('Refund Operation was send successfully');
          logger.info(jsonString);
          resolve(JSON.parse(jsonString));
        } catch (error) {
          logger.error(`Fail to refund order. ${error}`);
          reject(error);
        }
      });
    });
    postRequest.on('error', reject);
    postRequest.write(requestData);
    postRequest.end();
  });
};

export default showConfig;
