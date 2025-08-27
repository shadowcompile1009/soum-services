import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/addon';
import { GetAddonsRequest } from './proto/addon/GetAddonsRequest';
import { GetAddonsResponse } from './proto/addon/GetAddonsResponse';

let host = '0.0.0.0:50055';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.ADDON_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/addon.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const AddonGrpcSvc = new proto.addon.AddonService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();

export const getAddOns = (data: GetAddonsRequest): Promise<GetAddonsResponse> =>
  new Promise(async (resolve, reject) => {
    AddonGrpcSvc.getAddons(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
