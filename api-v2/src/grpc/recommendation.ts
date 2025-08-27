import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/recommendation';
import { AddFeedbackRequest } from './proto/recommendation/AddFeedbackRequest';
import { AddFeedbackResponse } from './proto/recommendation/AddFeedbackResponse';
import { AddMultipleItemsRequest } from './proto/recommendation/AddMultipleItemsRequest';
import { AddMultipleItemsResponse } from './proto/recommendation/AddMultipleItemsResponse';
import { AddNewItemRequest } from './proto/recommendation/AddNewItemRequest';
import { AddNewItemResponse } from './proto/recommendation/AddNewItemResponse';
import { AddNewUserRequest } from './proto/recommendation/AddNewUserRequest';
import { AddNewUserResponse } from './proto/recommendation/AddNewUserResponse';
import { DeleteItemsRequest } from './proto/recommendation/DeleteItemsRequest';
import { DeleteItemsResponse } from './proto/recommendation/DeleteItemsResponse';
import { RemoveFeedbackRequest } from './proto/recommendation/RemoveFeedbackRequest';
import { RemoveFeedbackResponse } from './proto/recommendation/RemoveFeedbackResponse';

let host = '0.0.0.0:50059';

if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.RECOMMENDATION_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/recommendation.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const RecommendationGrpcSvc = new proto.recommendation.RecommendationService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
// metadata.set('header1', 'headerValue1');

export const AddNewUser = (
  data: AddNewUserRequest
): Promise<AddNewUserResponse> =>
  new Promise(async (resolve, reject) => {
    RecommendationGrpcSvc.AddNewUser(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const AddNewItem = (
  data: AddNewItemRequest
): Promise<AddNewItemResponse> =>
  new Promise(async (resolve, reject) => {
    RecommendationGrpcSvc.AddNewItem(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const AddMultipleItems = (
  data: any
): Promise<AddMultipleItemsResponse> =>
  new Promise(async (resolve, reject) => {
    const reqPayload: AddMultipleItemsRequest = {
      items: data.map((elem: any) => {
        const gradeArray = ['', '0', null].includes(elem.grade)
          ? []
          : [elem.grade];
        return {
          itemId: elem.id,
          isHidden: false,
          labels: [
            ...elem.keywords_en,
            ...elem.variantName.split(', '),
            ...[`Price ${elem.sellPrice}`],
            ...gradeArray,
          ],
          categories: [elem.categoryId, elem.modelId, elem.brandId],
          timestamp: elem.createdDate.toISOString(),
        };
      }),
    };
    RecommendationGrpcSvc.AddMultipleItems(
      reqPayload,
      metadata,
      (error, reply) => {
        if (error) {
          reject(error);
        }
        resolve(reply);
      }
    );
  });

export const DeleteItems = (
  data: DeleteItemsRequest
): Promise<DeleteItemsResponse> =>
  new Promise(async (resolve, reject) => {
    RecommendationGrpcSvc.DeleteItems(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const AddFeedback = (
  data: AddFeedbackRequest
): Promise<AddFeedbackResponse> =>
  new Promise(async (resolve, reject) => {
    RecommendationGrpcSvc.AddFeedback(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const RemoveFeedback = (
  data: RemoveFeedbackRequest
): Promise<RemoveFeedbackResponse> =>
  new Promise(async (resolve, reject) => {
    RecommendationGrpcSvc.RemoveFeedback(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
