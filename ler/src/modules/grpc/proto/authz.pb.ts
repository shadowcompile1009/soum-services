/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "authz";

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  key: string;
  serviceName: string;
}

export interface Group {
  id: string;
  name: string;
  displayName: string;
}

export interface GetRoleRequest {
  id: string;
}

export interface GetRoleResponse {
  id: string;
  name: string;
  displayName: string;
  canAccessAll: boolean;
  group: Group | undefined;
  permissions: Permission[];
}

export interface GetGroupRolesRequest {
  groupId: string;
}

export interface GetGroupRolesResponse {
  roles: GetRoleResponse[];
}

export interface GetUserRolesRequest {
}

export interface GetUserRolesResponse {
  roles: GetRoleResponse[];
}

export const AUTHZ_PACKAGE_NAME = "authz";

export interface RoleServiceClient {
  getRole(request: GetRoleRequest): Observable<GetRoleResponse>;

  getGroupRoles(request: GetGroupRolesRequest): Observable<GetGroupRolesResponse>;

  getUserRoles(request: GetUserRolesRequest): Observable<GetUserRolesResponse>;
}

export interface RoleServiceController {
  getRole(request: GetRoleRequest): Promise<GetRoleResponse> | Observable<GetRoleResponse> | GetRoleResponse;

  getGroupRoles(
    request: GetGroupRolesRequest,
  ): Promise<GetGroupRolesResponse> | Observable<GetGroupRolesResponse> | GetGroupRolesResponse;

  getUserRoles(
    request: GetUserRolesRequest,
  ): Promise<GetUserRolesResponse> | Observable<GetUserRolesResponse> | GetUserRolesResponse;
}

export function RoleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getRole", "getGroupRoles", "getUserRoles"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("RoleService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("RoleService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ROLE_SERVICE_NAME = "RoleService";
