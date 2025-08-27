import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/authz';
import { GetGroupRolesRequest } from './proto/authz/GetGroupRolesRequest';
import { GetGroupRolesResponse } from './proto/authz/GetGroupRolesResponse';
import { GetRoleRequest } from './proto/authz/GetRoleRequest';
import { GetRoleResponse } from './proto/authz/GetRoleResponse';
import { GetUserRolesRequest } from './proto/authz/GetUserRolesRequest';
import { GetUserRolesResponse } from './proto/authz/GetUserRolesResponse';
import { GetUserDataRequest } from './proto/authz/GetUserDataRequest';
import { GetUserDataResponse } from './proto/authz/GetUserDataResponse';

let host = '0.0.0.0:50061';

if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.AUTHZ_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/authz.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const AuthzGrpcSvc = new proto.authz.RoleService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
// metadata.set('header1', 'headerValue1');

export const GetRole = (data: GetRoleRequest): Promise<GetRoleResponse> =>
  new Promise(async (resolve, reject) => {
    AuthzGrpcSvc.GetRole(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetGroupRoles = (
  data: GetGroupRolesRequest
): Promise<GetGroupRolesResponse> =>
  new Promise(async (resolve, reject) => {
    AuthzGrpcSvc.GetGroupRoles(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetUserRoles = (
  data: GetUserRolesRequest
): Promise<GetUserRolesResponse> =>
  new Promise(async (resolve, reject) => {
    AuthzGrpcSvc.GetUserRoles(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetUserData = (
  data: GetUserDataRequest
): Promise<GetUserDataResponse> =>
  new Promise(async (resolve, reject) => {
    AuthzGrpcSvc.GetUserData(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
