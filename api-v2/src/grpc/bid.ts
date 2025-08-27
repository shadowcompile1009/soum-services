import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/bid';
import { GetBidSettingsResponse } from './proto/bid/GetBidSettingsResponse';
import { GetBidSettingsRequest } from './proto/bid/GetBidSettingsRequest';
import { ClearExpiredProductBidsRequest } from './proto/bid/ClearExpiredProductBidsRequest';
import { ClearExpiredProductBidsResponse } from './proto/bid/ClearExpiredProductBidsResponse';
import { GetOfferForProductRequest } from './proto/bid/GetOfferForProductRequest';
import { OfferResponse } from './proto/bid/OfferResponse';
import { OfferCountResponse } from './proto/bid/OfferCountResponse';
import { GetOfferCountOfUserRequest } from './proto/bid/GetOfferCountOfUserRequest';

let host = '0.0.0.0:50053';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.BID_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/bid.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const BidGrpcSvc = new proto.bid.BidService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
// metadata.set('header1', 'headerValue1');
export const GetBidSettings = (
  payload: GetBidSettingsRequest
): Promise<GetBidSettingsResponse> =>
  new Promise(async (resolve, reject) => {
    BidGrpcSvc.GetBidSettings(payload, metadata, (error, reply) => {
      if (error) {
        console.log(error.message);
        reject(false);
      }
      resolve(reply);
    });
  });

export const ClearExpiredProductBids = (
  payload: ClearExpiredProductBidsRequest
): Promise<ClearExpiredProductBidsResponse> =>
  new Promise(async (resolve, reject) => {
    BidGrpcSvc.ClearExpiredProductBids(payload, metadata, (error, reply) => {
      if (error) {
        console.log(error.message);
        reject(false);
      }
      resolve(reply);
    });
  });

export const getOfferForProduct = (
  payload: GetOfferForProductRequest
): Promise<OfferResponse> =>
  new Promise(async (resolve, reject) => {
    BidGrpcSvc.getOfferForProduct(payload, metadata, (error, reply) => {
      if (error) {
        reject(null);
      }
      resolve(reply);
    });
  });

export const getOfferCountForUser = (
  payload: GetOfferCountOfUserRequest
): Promise<OfferCountResponse> =>
  new Promise(async (resolve, reject) => {
    BidGrpcSvc.getOfferCountOfUser(payload, metadata, (error, reply) => {
      if (error) {
        reject(null);
      }
      resolve(reply);
    });
  });
