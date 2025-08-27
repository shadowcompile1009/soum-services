import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/review';
import { GetRatingSellerRequest } from './proto/review/GetRatingSellerRequest';
import { GetRatingSellerResponse } from './proto/review/GetRatingSellerResponse';
import { GetResponseOfProductRequest } from './proto/review/GetResponseOfProductRequest';
import { GetResponseOfProductResponse } from './proto/review/GetResponseOfProductResponse';

let host = '0.0.0.0:50055';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.REVIEW_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/review.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const ReviewGrpcSvc = new proto.review.ReviewService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
// metadata.set('header1', 'headerValue1');

console.log(ReviewGrpcSvc, '-', metadata);
export const GetRatingSeller = (
  data: GetRatingSellerRequest
): Promise<GetRatingSellerResponse> =>
  new Promise(async (resolve, reject) => {
    ReviewGrpcSvc.GetRatingSeller(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetResponsesOfProduct = (
  data: GetResponseOfProductRequest
): Promise<GetResponseOfProductResponse> =>
  new Promise(async (resolve, reject) => {
    ReviewGrpcSvc.GetResponsesOfProduct(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });
