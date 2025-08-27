import { instanceToPlain } from 'class-transformer';

import {
  BuyerRefundDTO,
  BuyerRefundDTOV2,
  SellerEditPayoutDTO,
  SellerPayoutDTO,
} from '@/types/dto';
import { apiClientV2, apiGatewayClient } from '@/api/client';

import { CustomerType } from './Customer';

export interface IPaymentMethod {
  label: string;
  recommended: boolean;
  displayName: string;
}

export interface IBuyerOrderDetails {
  type: CustomerType;
  bankDetails: IBuyerBankDetail;
  paymentMethods: IPaymentMethod[];
  refundAmount: number; // refundAmountToPay
  paymentMethod: string; // buyerPaymentMethod
  grandTotal: number; // grandTotalForBuyer
  orderDate: string; // orderDate
  shippingCharges: number;
  sellPrice: number;
  buyerCommision: number;
  discountTotal: number;
  vat: number;
  isPayoutSuccess: boolean;
  isRefundSuccess: boolean;
  isReversalSuccess: boolean;
  isSuccessPayoutToWallet: boolean;
  isSuccessRefundToWallet: boolean;
  accountName: string;
  iban: string;
  bankName: string;
  walletBalance: string;
  walletTotalBalance: number;
  walletId: string;
  walletStatus: WalletStatus;
  buyerId: string;
  sellerId: string;
  sellerWalletDetail: number;
  listingFee: number;
  captureStatus: string;
  reservation: IBuyerReservationDetail;
  cancellationFee: number;
  refundAmountWithFeeToPay: number;
  isBNPL: boolean;
  refundStatus: string;
}

export interface ISellerOrderDetails {
  type: CustomerType;
  payoutAmount: number; // paymentAmoutToPay
  basePrice: number; // baseBuyPrice
  discount: number; // discount
  shippingCharges: number;
  vat: number;
  grandTotal: number; // grandTotal
  commissionAmount: number;
  commission: number;
  isPayoutSuccess: boolean;
  isRefundSuccess: boolean;
  isReversalSuccess: boolean;
  isSuccessPayoutToWallet: boolean;
  isSuccessRefundToWallet: boolean;
  isQuickPayout: boolean;
  accountName: string;
  iban: string;
  bankCode: string;
  bankDetails: ISellerBankDetail;
  walletBalance: string;
  walletId: string;
  walletStatus: WalletStatus;
  creditStatus: string;
}

export const OrderDetailsEndpoints = {
  orderDetails(orderId: string, type: CustomerType) {
    return `rest/api/v1/dm-orders/order/detail/${orderId}?type=${type}`;
  },
  orderDetailsV3(orderId: string, type: CustomerType) {
    return `dm-backend/orders/${orderId}/detail/${type}`;
  },
  getPenaltyFeeStatus(userId: string) {
    return `rest/api/v1/dm-securityfee/status/${userId}`;
  },
  applyPenaltyFee() {
    return `rest/api/v1/dm-securityfee/deduct-fee`;
  },
  buyerRefund(orderId: string) {
    return `rest/api/v1/dm-orders/refund/${orderId}`;
  },
  sellerPayout(orderId: string) {
    return `rest/api/v1/dm-orders/payout/${orderId}`;
  },
  sellerPayoutWalletCredit(orderId: string) {
    return `rest/api/v1/dm-orders/payout-credit/${orderId}`;
  },
  editSellerPayout(orderId: string) {
    return `rest/api/v1/dm-orders/payout/${orderId}`;
  },
  getCancelPayoutStatus(orderId: string, ownerId: string) {
    return `wallet/transactions/owner/${ownerId}/order/${orderId}/credit`;
  },
  closePaymentTabby(orderId: string) {
    return `api-v2/rest/api/v1/dm-orders/close/${orderId}`;
  },
  buyerRefundToWallet: 'wallet/transactions/buyer-refund',
  sellerPayoutToWallet: 'wallet/transactions/release-credit',
  cancelPayoutTabby: 'wallet/transactions/cancel-tabby-order-transaction',
};

export enum WalletStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}
interface IBuyerBankDetail {
  accountName: string;
  bankName: string;
  iban: string;
}

interface IBuyerReservationDetail {
  reservationAmount: number;
  reservationRemainingAmount: number;
}

interface IWalletDetail {
  balance: string;
  id: string;
  status: WalletStatus;
}

interface IWalletDetail {
  balance: string;
  id: string;
  status: WalletStatus;
  creditStatus: string;
}
interface ISellerWalletDetail {
  balance: number;
  totalBalance: number;
  id: string;
  status: WalletStatus;
}
interface ISellerBankDetail {
  accountName: string;
  bankCode: string;
  bankId: string;
  bankName: string;
  bankNameAr: string;
  iban: string;
}

interface IResponseBuyerOrderDetail {
  paymentMethods: IPaymentMethod[];
  bankDetails: IBuyerBankDetail;
  refundAmmountToPay: number;
  buyerPaymentMethod: string;
  grandTotalForBuyer: number;
  orderDate: string;
  shippingCharges: number;
  sellPrice: number;
  buyerCommision: number;
  discountTotal: number;
  vat: number;
  isSuccessPayout: boolean;
  isSuccessRefund: boolean;
  isSuccessReversal: boolean;
  isSuccessPayoutToWallet: boolean;
  isSuccessRefundToWallet: boolean;
  bankDetail: IBuyerBankDetail;
  walletDetail: IWalletDetail;
  buyer: string;
  seller: string;
  sellerWalletDetail: ISellerWalletDetail;
  listingFee: number;
  captureStatus: string;
  reservation: IBuyerReservationDetail;
  cancellationFee: number;
  refundAmountWithFeeToPay: number;
  isBNPL: boolean;
  refundStatus: string;
}

interface IResponseSellerOrderDetail {
  paymentAmoutToPay: number;
  baseBuyPrice: number;
  discount: number;
  shippingCharges: number;
  sellerCommisionAmount: number;
  vat: number;
  grandTotalForSeller: number;
  sellerCommission: number;
  isSuccessPayoutToWallet: boolean;
  isSuccessRefundToWallet: boolean;
  isQuickPayout: boolean;
  status: string;
  isSuccessPayout: boolean;
  isSuccessRefund: boolean;
  isSuccessReversal: boolean;
  sellerAccountName: string;
  sellerIBAN: string;
  sellerBIC: string;
  walletDetail: IWalletDetail;
  bankDetail: ISellerBankDetail;
}

export class SellerOrderDetails {
  static async payoutToWallet({
    orderId,
    walletId,
    releaseAmount,
  }: {
    orderId: string;
    walletId: string;
    releaseAmount: number;
  }) {
    const result = await apiGatewayClient.client.post(
      OrderDetailsEndpoints.sellerPayoutToWallet,
      {
        orderId,
        walletId,
        releaseAmount,
      }
    );
    return result.data;
  }

  static async postSellerPayout(orderId: string, formValues: SellerPayoutDTO) {
    const result = await apiClientV2.client.post(
      OrderDetailsEndpoints.sellerPayout(orderId),
      {
        grandTotal: formValues.amount,
        isQuickPayout: formValues.isQuickPayout,
      }
    );
    return result.data;
  }

  static async postEditPayout(
    orderId: string,
    formValues: SellerEditPayoutDTO
  ) {
    const result = await apiClientV2.client.put(
      OrderDetailsEndpoints.sellerPayout(orderId),
      {
        commission: formValues.commission,
        bankName: formValues.bank.bankName,
        iban: formValues.iban,
        accountName: formValues.accountName,
      }
    );
    return result.data;
  }
  static async postEditPayoutWalletCredit(orderId: string, commission: number) {
    const result = await apiClientV2.client.put(
      OrderDetailsEndpoints.sellerPayoutWalletCredit(orderId),
      {
        commission: commission,
      }
    );
    return result.data;
  }

  static async getSellerOrderDetails(orderId: string) {
    const result = await apiClientV2.client.get(
      OrderDetailsEndpoints.orderDetails(orderId, 'seller')
    );

    return result.data;
  }

  static async getSellerOrderDetailsV3(orderId: string) {
    const result = await apiGatewayClient.client.get(
      OrderDetailsEndpoints.orderDetailsV3(orderId, 'seller')
    );

    return result.data;
  }

  static mapOrderDetails(
    orderDetail: IResponseSellerOrderDetail
  ): SellerOrderDetails {
    const orderDetails = new SellerOrderDetails({
      type: 'seller',
      payoutAmount: orderDetail?.paymentAmoutToPay,
      basePrice: orderDetail?.baseBuyPrice,
      discount: orderDetail?.discount,
      shippingCharges: orderDetail?.shippingCharges,
      vat: orderDetail?.vat,
      grandTotal: orderDetail?.grandTotalForSeller,
      commissionAmount: orderDetail?.sellerCommisionAmount,
      commission: orderDetail?.sellerCommission,
      isPayoutSuccess: orderDetail?.isSuccessPayout,
      isRefundSuccess: orderDetail?.isSuccessRefund,
      isReversalSuccess: orderDetail?.isSuccessReversal,
      accountName: orderDetail?.bankDetail?.accountName,
      iban: orderDetail?.bankDetail?.iban,
      bankCode: orderDetail?.bankDetail?.bankCode,
      bankDetails: orderDetail?.bankDetail,
      walletId: orderDetail?.walletDetail?.id,
      walletBalance: orderDetail?.walletDetail?.balance,
      walletStatus: orderDetail?.walletDetail?.status,
      creditStatus: orderDetail?.walletDetail?.creditStatus,
      isSuccessPayoutToWallet: orderDetail?.isSuccessPayoutToWallet,
      isSuccessRefundToWallet: orderDetail?.isSuccessRefundToWallet,
      isQuickPayout: orderDetail?.isQuickPayout,
    });

    return instanceToPlain(orderDetails) as SellerOrderDetails;
  }

  public type: CustomerType;
  public payoutAmount: number; // paymentAmoutToPay
  public basePrice: number; // baseBuyPrice
  public discount: number; // discount
  public shippingCharges: number;
  public vat: number;
  public grandTotal: number; // grandTotal
  public commissionAmount: number;
  public commission: number;
  public isPayoutSuccess: boolean;
  public isRefundSuccess: boolean;
  public isReversalSuccess: boolean;
  public accountName: string;
  public iban: string;
  public bankCode: string;
  public bankDetails: ISellerBankDetail;
  public walletId: string;
  public walletBalance: string;
  public walletStatus: WalletStatus;
  public creditStatus: string;
  public isSuccessPayoutToWallet: boolean;
  public isSuccessRefundToWallet: boolean;
  public isQuickPayout: boolean;

  constructor({
    type,
    payoutAmount,
    basePrice,
    discount,
    shippingCharges,
    vat,
    grandTotal,
    commissionAmount,
    commission,
    isPayoutSuccess,
    isRefundSuccess,
    isReversalSuccess,
    accountName,
    iban,
    bankCode,
    bankDetails,
    walletId,
    walletBalance,
    walletStatus,
    creditStatus,
    isSuccessPayoutToWallet,
    isSuccessRefundToWallet,
    isQuickPayout,
  }: ISellerOrderDetails) {
    this.type = type;
    this.payoutAmount = payoutAmount;
    this.basePrice = basePrice;
    this.discount = discount;
    this.shippingCharges = shippingCharges;
    this.vat = vat;
    this.grandTotal = grandTotal;
    this.commissionAmount = commissionAmount;
    this.commission = commission;
    this.isPayoutSuccess = isPayoutSuccess;
    this.isRefundSuccess = isRefundSuccess;
    this.isReversalSuccess = isReversalSuccess;
    this.accountName = accountName;
    this.iban = iban;
    this.bankCode = bankCode;
    this.bankDetails = bankDetails;
    this.walletId = walletId;
    this.walletBalance = walletBalance;
    this.walletStatus = walletStatus;
    this.creditStatus = creditStatus;
    this.isSuccessPayoutToWallet = isSuccessPayoutToWallet;
    this.isSuccessRefundToWallet = isSuccessRefundToWallet;
    this.isQuickPayout = isQuickPayout;
  }
}

export class BuyerOrderDetails {
  static async refundToWallet(
    orderId: string,
    walletId: string,
    refundAmount: number
  ) {
    const result = await apiGatewayClient.client.post(
      OrderDetailsEndpoints.buyerRefundToWallet,
      {
        orderId,
        walletId,
        refundAmount,
      }
    );
    return result.data;
  }
  static async getCancelPayoutStatus(orderId: string, ownerId: string) {
    const result = await apiGatewayClient.client.get(
      OrderDetailsEndpoints.getCancelPayoutStatus(orderId, ownerId)
    );
    return result.data;
  }
  static async postCancelPayout(
    orderId: string,
    walletId: string,
    ownerId: string
  ) {
    const result = await apiGatewayClient.client.post(
      OrderDetailsEndpoints.cancelPayoutTabby,
      {
        walletId,
        orderId,
        ownerId,
      }
    );
    return result.data;
  }
  static async postCloselPayment(orderId: string) {
    const result = await apiGatewayClient.client.post(
      OrderDetailsEndpoints.closePaymentTabby(orderId),
      {}
    );
    return result.data;
  }
  static async getPenaltyFeeStatus(userId: string) {
    const result = await apiClientV2.client.get(
      OrderDetailsEndpoints.getPenaltyFeeStatus(userId)
    );
    return result.data.responseData;
  }

  static async putApplyPenaltyFee(orderId: string, userId: string) {
    const result = await apiClientV2.client.put(
      OrderDetailsEndpoints.applyPenaltyFee(),
      {
        orderId,
        userId,
      }
    );
    return result.data;
  }

  static async postBuyerRefund(orderId: string, formValues: BuyerRefundDTO) {
    const result = await apiClientV2.client.post(
      OrderDetailsEndpoints.buyerRefund(orderId),
      {
        paymentMethod: formValues.paymentMethod.label,
        amount: formValues.amount,
        iban: formValues?.iban,
        bankId: formValues?.bank?.id || '',
        accountName: formValues?.accountName,
      }
    );
    return result.data;
  }

  static async postBuyerRefundV3(
    orderId: string,
    formValues: BuyerRefundDTOV2
  ) {
    const result = await apiClientV2.client.post(
      OrderDetailsEndpoints.buyerRefund(orderId),
      {
        paymentMethod: formValues.paymentMethod.label,
        amount: formValues.amount,
        iban: formValues?.iban,
        bankId: formValues?.bank?.bankId || '',
        accountName: formValues?.accountName,
      }
    );
    return result.data;
  }

  static async getBuyerOrderDetails(orderId: string) {
    const result = await apiClientV2.client.get(
      OrderDetailsEndpoints.orderDetails(orderId, 'buyer')
    );

    return result.data;
  }

  static async getBuyerOrderDetailsV3(orderId: string) {
    const result = await apiGatewayClient.client.get(
      OrderDetailsEndpoints.orderDetailsV3(orderId, 'buyer')
    );

    return result.data;
  }

  static mapOrderDetails(orderDetail: IResponseBuyerOrderDetail) {
    const orderDetails = new BuyerOrderDetails({
      type: 'buyer',
      bankDetails: orderDetail?.bankDetail,
      paymentMethods: orderDetail?.paymentMethods,
      paymentMethod: orderDetail?.buyerPaymentMethod,
      refundAmount: orderDetail?.refundAmmountToPay,
      grandTotal: orderDetail?.grandTotalForBuyer,
      orderDate: orderDetail?.orderDate,
      shippingCharges: orderDetail?.shippingCharges,
      sellPrice: orderDetail?.sellPrice,
      buyerCommision: orderDetail?.buyerCommision,
      discountTotal: orderDetail?.discountTotal,
      vat: orderDetail?.vat,
      isPayoutSuccess: orderDetail?.isSuccessPayout,
      isRefundSuccess: orderDetail?.isSuccessRefund,
      isReversalSuccess: orderDetail?.isSuccessReversal,
      isSuccessPayoutToWallet: orderDetail?.isSuccessPayoutToWallet,
      isSuccessRefundToWallet: orderDetail?.isSuccessRefundToWallet,
      accountName: orderDetail?.bankDetail?.accountName,
      iban: orderDetail?.bankDetail?.iban,
      bankName: orderDetail?.bankDetail?.bankName,
      walletId: orderDetail?.walletDetail?.id,
      walletBalance: orderDetail?.walletDetail?.balance,
      walletTotalBalance: orderDetail?.sellerWalletDetail?.totalBalance,
      walletStatus: orderDetail?.walletDetail?.status,
      buyerId: orderDetail?.buyer,
      sellerId: orderDetail?.seller,
      sellerWalletDetail: orderDetail?.sellerWalletDetail?.balance,
      listingFee: orderDetail?.listingFee,
      captureStatus: orderDetail?.captureStatus,
      reservation: orderDetail?.reservation,
      cancellationFee: orderDetail?.cancellationFee,
      refundAmountWithFeeToPay: orderDetail?.refundAmountWithFeeToPay,
      isBNPL: orderDetail?.isBNPL,
      refundStatus: orderDetail?.refundStatus,
    });

    return instanceToPlain(orderDetails) as BuyerOrderDetails;
  }

  public type: CustomerType;
  public bankDetails: IBuyerBankDetail;
  public paymentMethods: IPaymentMethod[];
  public refundAmount: number; // refundAmountToPay
  public paymentMethod: string; // buyerPaymentMethod
  public grandTotal: number; // grandTotalForBuyer
  public orderDate: string; // orderDate
  public shippingCharges: number;
  public sellPrice: number;
  public buyerCommision: number;
  public discountTotal: number;
  public vat: number;
  public isPayoutSuccess: boolean;
  public isRefundSuccess: boolean;
  public isReversalSuccess: boolean;
  public accountName: string;
  public iban: string;
  public bankName: string;
  public walletId: string;
  public walletBalance: string;
  public walletTotalBalance: number;
  public walletStatus: WalletStatus;
  public isSuccessPayoutToWallet: boolean;
  public isSuccessRefundToWallet: boolean;
  public sellerId: string;
  public buyerId: string;
  public sellerWalletDetail: number;
  public listingFee: number;
  public captureStatus: string;
  public reservationAmount: number;
  public reservationRemainingAmount: number;
  public cancellationFee: number;
  public refundAmountWithFeeToPay: number;
  public isBNPL: boolean;
  public refundStatus: string;

  constructor({
    type,
    bankDetails,
    paymentMethods,
    paymentMethod,
    refundAmount,
    grandTotal,
    orderDate,
    shippingCharges,
    sellPrice,
    buyerCommision,
    discountTotal,
    vat,
    isPayoutSuccess,
    isRefundSuccess,
    isReversalSuccess,
    accountName,
    iban,
    bankName,
    walletId,
    walletBalance,
    walletTotalBalance,
    walletStatus,
    isSuccessPayoutToWallet,
    isSuccessRefundToWallet,
    sellerId,
    buyerId,
    sellerWalletDetail,
    listingFee,
    captureStatus,
    reservation,
    cancellationFee,
    refundAmountWithFeeToPay,
    isBNPL,
    refundStatus,
  }: IBuyerOrderDetails) {
    this.type = type;
    this.bankDetails = bankDetails;
    this.paymentMethods = paymentMethods;
    this.paymentMethod = paymentMethod;
    this.refundAmount = refundAmount;
    this.grandTotal = grandTotal;
    this.orderDate = orderDate;
    this.shippingCharges = shippingCharges;
    this.sellPrice = sellPrice;
    this.buyerCommision = buyerCommision;
    this.discountTotal = discountTotal;
    this.vat = vat;
    this.isPayoutSuccess = isPayoutSuccess;
    this.isRefundSuccess = isRefundSuccess;
    this.isReversalSuccess = isReversalSuccess;
    this.accountName = accountName;
    this.iban = iban;
    this.bankName = bankName;
    this.walletId = walletId;
    this.walletBalance = walletBalance;
    this.walletTotalBalance = walletTotalBalance;
    this.walletStatus = walletStatus;
    this.isSuccessPayoutToWallet = isSuccessPayoutToWallet;
    this.isSuccessRefundToWallet = isSuccessRefundToWallet;
    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.sellerWalletDetail = sellerWalletDetail;
    this.listingFee = listingFee;
    this.captureStatus = captureStatus;
    this.reservationAmount = reservation?.reservationAmount || 0;
    this.reservationRemainingAmount =
      reservation?.reservationRemainingAmount || 0;
    this.cancellationFee = cancellationFee || 0;
    this.refundAmountWithFeeToPay = refundAmountWithFeeToPay || 0;
    this.isBNPL = isBNPL;
    this.refundStatus = refundStatus;
  }
}
