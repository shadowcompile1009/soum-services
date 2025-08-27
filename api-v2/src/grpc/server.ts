import { Server, ServerCredentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { ProtoGrpcType } from './proto/v2';

import Calls from './calls';

const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/v2.proto'
);
const v2Proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const server = new Server();

const host = `0.0.0.0:${process.env.GRPC_PORT}`;
server.addService(v2Proto.v2.V2Service.service, Calls);

export const startGRPCServer = () => {
  return server.bindAsync(host, ServerCredentials.createInsecure(), () => {
    server.start();

    console.log(
      `🚀🚀🚀 GRPC server is running on localhost:${process.env.GRPC_PORT}`
    );
  });
};
