import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js/build/src';
import { PaymentService } from '../services/paymentService';
import { Container } from 'typedi';
import {
  GetListingFeesRequest,
  GetListingFeesResponse,
  UpdateSecurityFeeRequest,
  UpdateSecurityFeeResponse,
} from './proto/v2.pb';

const paymentService = Container.get(PaymentService);

export const GetListingFees = async (
  call: ServerUnaryCall<GetListingFeesRequest, GetListingFeesResponse>,
  callback: sendUnaryData<GetListingFeesResponse>
) => {
  try {
    const response = await paymentService.getListingFeesValue();

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const UpdateSecurityFee = async (
  call: ServerUnaryCall<UpdateSecurityFeeRequest, UpdateSecurityFeeResponse>,
  callback: sendUnaryData<UpdateSecurityFeeResponse>
) => {
  try {
    const { userId, amount, isOptIn } = call.request;
    await paymentService.updateSecurityFeesOption(amount, userId, isOptIn);

    callback(null, {});
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};
