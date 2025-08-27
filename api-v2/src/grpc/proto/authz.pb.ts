/* eslint-disable */
import _m0 from "protobufjs/minimal";

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

export interface GetUserDataRequest {
  userId: string;
}

export interface GetUserDataResponse {
  storeCRN: string;
  operatingModel: string;
  businessModel: string;
  sellerType: string;
  sellerCategory: string;
}

export interface GetUserRolesRequest {
}

export interface GetUserRolesResponse {
  roles: GetRoleResponse[];
}

function createBasePermission(): Permission {
  return { id: "", name: "", displayName: "", key: "", serviceName: "" };
}

export const Permission = {
  encode(message: Permission, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.key !== "") {
      writer.uint32(34).string(message.key);
    }
    if (message.serviceName !== "") {
      writer.uint32(42).string(message.serviceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Permission {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePermission();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.key = reader.string();
          break;
        case 5:
          message.serviceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Permission {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
      key: isSet(object.key) ? String(object.key) : "",
      serviceName: isSet(object.serviceName) ? String(object.serviceName) : "",
    };
  },

  toJSON(message: Permission): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined && (obj.displayName = message.displayName);
    message.key !== undefined && (obj.key = message.key);
    message.serviceName !== undefined && (obj.serviceName = message.serviceName);
    return obj;
  },

  create<I extends Exact<DeepPartial<Permission>, I>>(base?: I): Permission {
    return Permission.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Permission>, I>>(object: I): Permission {
    const message = createBasePermission();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.displayName = object.displayName ?? "";
    message.key = object.key ?? "";
    message.serviceName = object.serviceName ?? "";
    return message;
  },
};

function createBaseGroup(): Group {
  return { id: "", name: "", displayName: "" };
}

export const Group = {
  encode(message: Group, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Group {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroup();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Group {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
    };
  },

  toJSON(message: Group): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined && (obj.displayName = message.displayName);
    return obj;
  },

  create<I extends Exact<DeepPartial<Group>, I>>(base?: I): Group {
    return Group.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Group>, I>>(object: I): Group {
    const message = createBaseGroup();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.displayName = object.displayName ?? "";
    return message;
  },
};

function createBaseGetRoleRequest(): GetRoleRequest {
  return { id: "" };
}

export const GetRoleRequest = {
  encode(message: GetRoleRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRoleRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRoleRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRoleRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetRoleRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRoleRequest>, I>>(base?: I): GetRoleRequest {
    return GetRoleRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRoleRequest>, I>>(object: I): GetRoleRequest {
    const message = createBaseGetRoleRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetRoleResponse(): GetRoleResponse {
  return { id: "", name: "", displayName: "", canAccessAll: false, group: undefined, permissions: [] };
}

export const GetRoleResponse = {
  encode(message: GetRoleResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.canAccessAll === true) {
      writer.uint32(32).bool(message.canAccessAll);
    }
    if (message.group !== undefined) {
      Group.encode(message.group, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.permissions) {
      Permission.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRoleResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRoleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.canAccessAll = reader.bool();
          break;
        case 5:
          message.group = Group.decode(reader, reader.uint32());
          break;
        case 6:
          message.permissions.push(Permission.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRoleResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
      canAccessAll: isSet(object.canAccessAll) ? Boolean(object.canAccessAll) : false,
      group: isSet(object.group) ? Group.fromJSON(object.group) : undefined,
      permissions: Array.isArray(object?.permissions) ? object.permissions.map((e: any) => Permission.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetRoleResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined && (obj.displayName = message.displayName);
    message.canAccessAll !== undefined && (obj.canAccessAll = message.canAccessAll);
    message.group !== undefined && (obj.group = message.group ? Group.toJSON(message.group) : undefined);
    if (message.permissions) {
      obj.permissions = message.permissions.map((e) => e ? Permission.toJSON(e) : undefined);
    } else {
      obj.permissions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRoleResponse>, I>>(base?: I): GetRoleResponse {
    return GetRoleResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRoleResponse>, I>>(object: I): GetRoleResponse {
    const message = createBaseGetRoleResponse();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.displayName = object.displayName ?? "";
    message.canAccessAll = object.canAccessAll ?? false;
    message.group = (object.group !== undefined && object.group !== null) ? Group.fromPartial(object.group) : undefined;
    message.permissions = object.permissions?.map((e) => Permission.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetGroupRolesRequest(): GetGroupRolesRequest {
  return { groupId: "" };
}

export const GetGroupRolesRequest = {
  encode(message: GetGroupRolesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.groupId !== "") {
      writer.uint32(10).string(message.groupId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetGroupRolesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetGroupRolesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.groupId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetGroupRolesRequest {
    return { groupId: isSet(object.groupId) ? String(object.groupId) : "" };
  },

  toJSON(message: GetGroupRolesRequest): unknown {
    const obj: any = {};
    message.groupId !== undefined && (obj.groupId = message.groupId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetGroupRolesRequest>, I>>(base?: I): GetGroupRolesRequest {
    return GetGroupRolesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetGroupRolesRequest>, I>>(object: I): GetGroupRolesRequest {
    const message = createBaseGetGroupRolesRequest();
    message.groupId = object.groupId ?? "";
    return message;
  },
};

function createBaseGetGroupRolesResponse(): GetGroupRolesResponse {
  return { roles: [] };
}

export const GetGroupRolesResponse = {
  encode(message: GetGroupRolesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.roles) {
      GetRoleResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetGroupRolesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetGroupRolesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roles.push(GetRoleResponse.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetGroupRolesResponse {
    return { roles: Array.isArray(object?.roles) ? object.roles.map((e: any) => GetRoleResponse.fromJSON(e)) : [] };
  },

  toJSON(message: GetGroupRolesResponse): unknown {
    const obj: any = {};
    if (message.roles) {
      obj.roles = message.roles.map((e) => e ? GetRoleResponse.toJSON(e) : undefined);
    } else {
      obj.roles = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetGroupRolesResponse>, I>>(base?: I): GetGroupRolesResponse {
    return GetGroupRolesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetGroupRolesResponse>, I>>(object: I): GetGroupRolesResponse {
    const message = createBaseGetGroupRolesResponse();
    message.roles = object.roles?.map((e) => GetRoleResponse.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetUserDataRequest(): GetUserDataRequest {
  return { userId: "" };
}

export const GetUserDataRequest = {
  encode(message: GetUserDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserDataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserDataRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: GetUserDataRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserDataRequest>, I>>(base?: I): GetUserDataRequest {
    return GetUserDataRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserDataRequest>, I>>(object: I): GetUserDataRequest {
    const message = createBaseGetUserDataRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetUserDataResponse(): GetUserDataResponse {
  return { storeCRN: "", operatingModel: "", businessModel: "", sellerType: "", sellerCategory: "" };
}

export const GetUserDataResponse = {
  encode(message: GetUserDataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.storeCRN !== "") {
      writer.uint32(10).string(message.storeCRN);
    }
    if (message.operatingModel !== "") {
      writer.uint32(18).string(message.operatingModel);
    }
    if (message.businessModel !== "") {
      writer.uint32(26).string(message.businessModel);
    }
    if (message.sellerType !== "") {
      writer.uint32(34).string(message.sellerType);
    }
    if (message.sellerCategory !== "") {
      writer.uint32(42).string(message.sellerCategory);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.storeCRN = reader.string();
          break;
        case 2:
          message.operatingModel = reader.string();
          break;
        case 3:
          message.businessModel = reader.string();
          break;
        case 4:
          message.sellerType = reader.string();
          break;
        case 5:
          message.sellerCategory = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserDataResponse {
    return {
      storeCRN: isSet(object.storeCRN) ? String(object.storeCRN) : "",
      operatingModel: isSet(object.operatingModel) ? String(object.operatingModel) : "",
      businessModel: isSet(object.businessModel) ? String(object.businessModel) : "",
      sellerType: isSet(object.sellerType) ? String(object.sellerType) : "",
      sellerCategory: isSet(object.sellerCategory) ? String(object.sellerCategory) : "",
    };
  },

  toJSON(message: GetUserDataResponse): unknown {
    const obj: any = {};
    message.storeCRN !== undefined && (obj.storeCRN = message.storeCRN);
    message.operatingModel !== undefined && (obj.operatingModel = message.operatingModel);
    message.businessModel !== undefined && (obj.businessModel = message.businessModel);
    message.sellerType !== undefined && (obj.sellerType = message.sellerType);
    message.sellerCategory !== undefined && (obj.sellerCategory = message.sellerCategory);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserDataResponse>, I>>(base?: I): GetUserDataResponse {
    return GetUserDataResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserDataResponse>, I>>(object: I): GetUserDataResponse {
    const message = createBaseGetUserDataResponse();
    message.storeCRN = object.storeCRN ?? "";
    message.operatingModel = object.operatingModel ?? "";
    message.businessModel = object.businessModel ?? "";
    message.sellerType = object.sellerType ?? "";
    message.sellerCategory = object.sellerCategory ?? "";
    return message;
  },
};

function createBaseGetUserRolesRequest(): GetUserRolesRequest {
  return {};
}

export const GetUserRolesRequest = {
  encode(_: GetUserRolesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserRolesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserRolesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetUserRolesRequest {
    return {};
  },

  toJSON(_: GetUserRolesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserRolesRequest>, I>>(base?: I): GetUserRolesRequest {
    return GetUserRolesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserRolesRequest>, I>>(_: I): GetUserRolesRequest {
    const message = createBaseGetUserRolesRequest();
    return message;
  },
};

function createBaseGetUserRolesResponse(): GetUserRolesResponse {
  return { roles: [] };
}

export const GetUserRolesResponse = {
  encode(message: GetUserRolesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.roles) {
      GetRoleResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserRolesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserRolesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roles.push(GetRoleResponse.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserRolesResponse {
    return { roles: Array.isArray(object?.roles) ? object.roles.map((e: any) => GetRoleResponse.fromJSON(e)) : [] };
  },

  toJSON(message: GetUserRolesResponse): unknown {
    const obj: any = {};
    if (message.roles) {
      obj.roles = message.roles.map((e) => e ? GetRoleResponse.toJSON(e) : undefined);
    } else {
      obj.roles = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserRolesResponse>, I>>(base?: I): GetUserRolesResponse {
    return GetUserRolesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserRolesResponse>, I>>(object: I): GetUserRolesResponse {
    const message = createBaseGetUserRolesResponse();
    message.roles = object.roles?.map((e) => GetRoleResponse.fromPartial(e)) || [];
    return message;
  },
};

export interface RoleService {
  GetRole(request: GetRoleRequest): Promise<GetRoleResponse>;
  GetGroupRoles(request: GetGroupRolesRequest): Promise<GetGroupRolesResponse>;
  GetUserRoles(request: GetUserRolesRequest): Promise<GetUserRolesResponse>;
  GetUserData(request: GetUserDataRequest): Promise<GetUserDataResponse>;
}

export class RoleServiceClientImpl implements RoleService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "authz.RoleService";
    this.rpc = rpc;
    this.GetRole = this.GetRole.bind(this);
    this.GetGroupRoles = this.GetGroupRoles.bind(this);
    this.GetUserRoles = this.GetUserRoles.bind(this);
    this.GetUserData = this.GetUserData.bind(this);
  }
  GetRole(request: GetRoleRequest): Promise<GetRoleResponse> {
    const data = GetRoleRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetRole", data);
    return promise.then((data) => GetRoleResponse.decode(new _m0.Reader(data)));
  }

  GetGroupRoles(request: GetGroupRolesRequest): Promise<GetGroupRolesResponse> {
    const data = GetGroupRolesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetGroupRoles", data);
    return promise.then((data) => GetGroupRolesResponse.decode(new _m0.Reader(data)));
  }

  GetUserRoles(request: GetUserRolesRequest): Promise<GetUserRolesResponse> {
    const data = GetUserRolesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUserRoles", data);
    return promise.then((data) => GetUserRolesResponse.decode(new _m0.Reader(data)));
  }

  GetUserData(request: GetUserDataRequest): Promise<GetUserDataResponse> {
    const data = GetUserDataRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUserData", data);
    return promise.then((data) => GetUserDataResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
