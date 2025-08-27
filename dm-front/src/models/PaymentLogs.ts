import { instanceToPlain } from 'class-transformer';
import { apiGatewayClient } from '@/api';

export interface IPaymentLogsResponse {
  userName: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  actionDate: string;
  productId?: string;
  soumNumber?: string;
  mobileNumber?: string;
  amount?: string;
  sourcePlatform?: string;
  errorMessage?: string;
  paymentErrorId: string;
  paymentProvidor?: string;
  paymentProviderType?: string;
}

export const PaymentLogsEndpoints = {
  paymentHistory(
    limit: string,
    offset: string,
    mobileNumber?: string,
    paymentErrorId?: string,
    soumNumber?: string
  ) {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset);

    // Add optional parameters only if they are defined
    if (mobileNumber) params.append('mobileNumber', mobileNumber);
    if (paymentErrorId) params.append('paymentErrorId', paymentErrorId);
    if (soumNumber) params.append('soumNumber', soumNumber);

    return `activity-log/payment-error?${params.toString()}`;
  },
};

export class PaymentLogs {
  static async getPaymentHistory({
    limit,
    offset,
    mobileNumber,
    paymentErrorId,
    soumNumber,
  }: {
    limit: string;
    offset: string;
    mobileNumber: string;
    paymentErrorId: string;
    soumNumber: string;
  }) {
    const endPoint = PaymentLogsEndpoints.paymentHistory(
      limit,
      offset,
      mobileNumber,
      paymentErrorId,
      soumNumber
    );
    const result = await apiGatewayClient.client.get(endPoint);
    return result.data;
  }

  static mapPaymentHistory(
    paymentHistory: IPaymentLogsResponse[] = []
  ): PaymentLogs[] {
    const mappedPaymentHistory = paymentHistory.map(
      (payment) =>
        new PaymentLogs({
          userName: payment?.userName,
          orderId: payment?.orderId,
          createdAt: payment?.createdAt,
          updatedAt: payment?.updatedAt,
          actionDate: payment?.actionDate,
          productId: payment?.productId,
          soumNumber: payment?.soumNumber,
          mobileNumber: payment?.mobileNumber,
          amount: payment?.amount,
          sourcePlatform: payment?.sourcePlatform,
          errorMessage: payment?.errorMessage,
          paymentErrorId: payment?.paymentErrorId,
          paymentProvidor: payment?.paymentProvidor,
        })
    );

    return instanceToPlain(mappedPaymentHistory) as PaymentLogs[];
  }

  public userName: string;
  public orderId?: string;
  public createdAt: string;
  public updatedAt: string;
  public actionDate: string;
  public productId?: string;
  public soumNumber?: string;
  public mobileNumber?: string;
  public errorMessage?: string;
  public paymentErrorId: string;
  public paymentProvidor?: string;
  public sourcePlatform?: string;
  public amount?: string;

  constructor({
    userName,
    orderId,
    createdAt,
    updatedAt,
    actionDate,
    productId,
    soumNumber,
    mobileNumber,
    amount,
    sourcePlatform,
    errorMessage,
    paymentErrorId,
    paymentProvidor,
  }: IPaymentLogsResponse) {
    this.userName = userName;
    this.orderId = orderId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.actionDate = actionDate;
    this.productId = productId;
    this.soumNumber = soumNumber;
    this.mobileNumber = mobileNumber;
    this.amount = amount;
    this.sourcePlatform = sourcePlatform;
    this.errorMessage = errorMessage;
    this.paymentErrorId = paymentErrorId;
    this.paymentProvidor = paymentProvidor;
  }
}
