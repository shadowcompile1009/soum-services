import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/activity';
import { GetUserActivityResponse } from './proto/activity/GetUserActivityResponse';
import { GetUserActivityRequest } from './proto/activity/GetUserActivityRequest';

let host = '0.0.0.0:50052';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.ACTIVITY_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/activity.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const ActivityGrpcSvc = new proto.activity.ActivityService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
// metadata.set('header1', 'headerValue1');
export const GetUserActivity = (
  payload: GetUserActivityRequest
): Promise<GetUserActivityResponse> =>
  new Promise(async (resolve, reject) => {
    ActivityGrpcSvc.GetUserActivity(payload, metadata, (error, reply) => {
      if (error) {
        console.log(error.message);
        reject(false);
      }
      resolve(reply);
    });
  });
