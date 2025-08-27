/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ler";

export interface GetCityTiersRequest {
  name: string;
}

export interface GetCityTiersResponse {
  name: string;
  sellerTier: number;
  buyerTier: number;
}

export interface MapLogisticsServicesRequest {
  sellerCityTier: number;
  buyerCityTier: number;
  isKeySeller: boolean;
}

export interface MapLogisticsServicesResponse {
  logisticServices: string;
  vendorId: string;
  isAvailableToPickup: boolean;
  serviceId: string;
  isAvailableToOneService: boolean;
}

export interface GetLogisticServicesRequest {
}

export interface GetLogisticServicesResponse {
  services: GetLogisticServicesResponse_LogisticService[];
  vendors: GetLogisticServicesResponse_LogisticVendor[];
}

export interface GetLogisticServicesResponse_LogisticService {
  serviceId: string;
  serviceName: string;
}

export interface GetLogisticServicesResponse_LogisticVendor {
  vendorId: string;
  vendorName: string;
  services: string;
}

export interface CreatePickupRequest {
  referenceNo: string;
  originCity: string;
  destinationCity: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  trackingNumber: string;
  description: string;
}

export interface CreateShipmentReq {
  sender: User | undefined;
  receiver: User | undefined;
  trackingNumber: string;
  description: string;
  grandTotal: number;
  shipmentType: string;
  serviceName: string;
  isConsignment?: boolean | undefined;
}

export interface User {
  name: string;
  mobileNumber: string;
  address: string;
  email: string;
  userType: string;
  city: string;
  latitude?: string | undefined;
  longitude?: string | undefined;
}

export interface CreatePickupForAccessoriesRequest {
  referenceNo: string;
  originCity: string;
  destinationCity: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  trackingNumber: string;
  description: string;
  skudetails: SkuDetails[];
}

export interface CreatePickupResponse {
  awbNo: string;
}

export interface CreateShipmentResponse {
  trackingNumber: string;
}

export interface GetPickupStatusRequest {
  awbNo: string[];
  isDelivered: boolean;
}

export interface SkuDetails {
  sku: string;
  description: string;
  cod: string;
  piece: string;
  weight: string;
}

export interface CancelShipmentRequest {
  /** Field for order or tracking ID */
  trackingOrOrderId: string;
}

export interface CancelShipmentResponse {
  success: boolean;
  message: string;
}

function createBaseGetCityTiersRequest(): GetCityTiersRequest {
  return { name: "" };
}

export const GetCityTiersRequest = {
  encode(message: GetCityTiersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCityTiersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCityTiersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCityTiersRequest {
    return { name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: GetCityTiersRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCityTiersRequest>, I>>(base?: I): GetCityTiersRequest {
    return GetCityTiersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCityTiersRequest>, I>>(object: I): GetCityTiersRequest {
    const message = createBaseGetCityTiersRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseGetCityTiersResponse(): GetCityTiersResponse {
  return { name: "", sellerTier: 0, buyerTier: 0 };
}

export const GetCityTiersResponse = {
  encode(message: GetCityTiersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.sellerTier !== 0) {
      writer.uint32(16).int32(message.sellerTier);
    }
    if (message.buyerTier !== 0) {
      writer.uint32(24).int32(message.buyerTier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCityTiersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCityTiersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.sellerTier = reader.int32();
          break;
        case 3:
          message.buyerTier = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCityTiersResponse {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      sellerTier: isSet(object.sellerTier) ? Number(object.sellerTier) : 0,
      buyerTier: isSet(object.buyerTier) ? Number(object.buyerTier) : 0,
    };
  },

  toJSON(message: GetCityTiersResponse): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.sellerTier !== undefined && (obj.sellerTier = Math.round(message.sellerTier));
    message.buyerTier !== undefined && (obj.buyerTier = Math.round(message.buyerTier));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCityTiersResponse>, I>>(base?: I): GetCityTiersResponse {
    return GetCityTiersResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCityTiersResponse>, I>>(object: I): GetCityTiersResponse {
    const message = createBaseGetCityTiersResponse();
    message.name = object.name ?? "";
    message.sellerTier = object.sellerTier ?? 0;
    message.buyerTier = object.buyerTier ?? 0;
    return message;
  },
};

function createBaseMapLogisticsServicesRequest(): MapLogisticsServicesRequest {
  return { sellerCityTier: 0, buyerCityTier: 0, isKeySeller: false };
}

export const MapLogisticsServicesRequest = {
  encode(message: MapLogisticsServicesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerCityTier !== 0) {
      writer.uint32(8).int32(message.sellerCityTier);
    }
    if (message.buyerCityTier !== 0) {
      writer.uint32(16).int32(message.buyerCityTier);
    }
    if (message.isKeySeller === true) {
      writer.uint32(24).bool(message.isKeySeller);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapLogisticsServicesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapLogisticsServicesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellerCityTier = reader.int32();
          break;
        case 2:
          message.buyerCityTier = reader.int32();
          break;
        case 3:
          message.isKeySeller = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MapLogisticsServicesRequest {
    return {
      sellerCityTier: isSet(object.sellerCityTier) ? Number(object.sellerCityTier) : 0,
      buyerCityTier: isSet(object.buyerCityTier) ? Number(object.buyerCityTier) : 0,
      isKeySeller: isSet(object.isKeySeller) ? Boolean(object.isKeySeller) : false,
    };
  },

  toJSON(message: MapLogisticsServicesRequest): unknown {
    const obj: any = {};
    message.sellerCityTier !== undefined && (obj.sellerCityTier = Math.round(message.sellerCityTier));
    message.buyerCityTier !== undefined && (obj.buyerCityTier = Math.round(message.buyerCityTier));
    message.isKeySeller !== undefined && (obj.isKeySeller = message.isKeySeller);
    return obj;
  },

  create<I extends Exact<DeepPartial<MapLogisticsServicesRequest>, I>>(base?: I): MapLogisticsServicesRequest {
    return MapLogisticsServicesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MapLogisticsServicesRequest>, I>>(object: I): MapLogisticsServicesRequest {
    const message = createBaseMapLogisticsServicesRequest();
    message.sellerCityTier = object.sellerCityTier ?? 0;
    message.buyerCityTier = object.buyerCityTier ?? 0;
    message.isKeySeller = object.isKeySeller ?? false;
    return message;
  },
};

function createBaseMapLogisticsServicesResponse(): MapLogisticsServicesResponse {
  return {
    logisticServices: "",
    vendorId: "",
    isAvailableToPickup: false,
    serviceId: "",
    isAvailableToOneService: false,
  };
}

export const MapLogisticsServicesResponse = {
  encode(message: MapLogisticsServicesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.logisticServices !== "") {
      writer.uint32(10).string(message.logisticServices);
    }
    if (message.vendorId !== "") {
      writer.uint32(18).string(message.vendorId);
    }
    if (message.isAvailableToPickup === true) {
      writer.uint32(24).bool(message.isAvailableToPickup);
    }
    if (message.serviceId !== "") {
      writer.uint32(34).string(message.serviceId);
    }
    if (message.isAvailableToOneService === true) {
      writer.uint32(40).bool(message.isAvailableToOneService);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapLogisticsServicesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapLogisticsServicesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.logisticServices = reader.string();
          break;
        case 2:
          message.vendorId = reader.string();
          break;
        case 3:
          message.isAvailableToPickup = reader.bool();
          break;
        case 4:
          message.serviceId = reader.string();
          break;
        case 5:
          message.isAvailableToOneService = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MapLogisticsServicesResponse {
    return {
      logisticServices: isSet(object.logisticServices) ? String(object.logisticServices) : "",
      vendorId: isSet(object.vendorId) ? String(object.vendorId) : "",
      isAvailableToPickup: isSet(object.isAvailableToPickup) ? Boolean(object.isAvailableToPickup) : false,
      serviceId: isSet(object.serviceId) ? String(object.serviceId) : "",
      isAvailableToOneService: isSet(object.isAvailableToOneService) ? Boolean(object.isAvailableToOneService) : false,
    };
  },

  toJSON(message: MapLogisticsServicesResponse): unknown {
    const obj: any = {};
    message.logisticServices !== undefined && (obj.logisticServices = message.logisticServices);
    message.vendorId !== undefined && (obj.vendorId = message.vendorId);
    message.isAvailableToPickup !== undefined && (obj.isAvailableToPickup = message.isAvailableToPickup);
    message.serviceId !== undefined && (obj.serviceId = message.serviceId);
    message.isAvailableToOneService !== undefined && (obj.isAvailableToOneService = message.isAvailableToOneService);
    return obj;
  },

  create<I extends Exact<DeepPartial<MapLogisticsServicesResponse>, I>>(base?: I): MapLogisticsServicesResponse {
    return MapLogisticsServicesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MapLogisticsServicesResponse>, I>>(object: I): MapLogisticsServicesResponse {
    const message = createBaseMapLogisticsServicesResponse();
    message.logisticServices = object.logisticServices ?? "";
    message.vendorId = object.vendorId ?? "";
    message.isAvailableToPickup = object.isAvailableToPickup ?? false;
    message.serviceId = object.serviceId ?? "";
    message.isAvailableToOneService = object.isAvailableToOneService ?? false;
    return message;
  },
};

function createBaseGetLogisticServicesRequest(): GetLogisticServicesRequest {
  return {};
}

export const GetLogisticServicesRequest = {
  encode(_: GetLogisticServicesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLogisticServicesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLogisticServicesRequest();
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

  fromJSON(_: any): GetLogisticServicesRequest {
    return {};
  },

  toJSON(_: GetLogisticServicesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLogisticServicesRequest>, I>>(base?: I): GetLogisticServicesRequest {
    return GetLogisticServicesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLogisticServicesRequest>, I>>(_: I): GetLogisticServicesRequest {
    const message = createBaseGetLogisticServicesRequest();
    return message;
  },
};

function createBaseGetLogisticServicesResponse(): GetLogisticServicesResponse {
  return { services: [], vendors: [] };
}

export const GetLogisticServicesResponse = {
  encode(message: GetLogisticServicesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.services) {
      GetLogisticServicesResponse_LogisticService.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.vendors) {
      GetLogisticServicesResponse_LogisticVendor.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLogisticServicesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLogisticServicesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.services.push(GetLogisticServicesResponse_LogisticService.decode(reader, reader.uint32()));
          break;
        case 2:
          message.vendors.push(GetLogisticServicesResponse_LogisticVendor.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLogisticServicesResponse {
    return {
      services: Array.isArray(object?.services)
        ? object.services.map((e: any) => GetLogisticServicesResponse_LogisticService.fromJSON(e))
        : [],
      vendors: Array.isArray(object?.vendors)
        ? object.vendors.map((e: any) => GetLogisticServicesResponse_LogisticVendor.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetLogisticServicesResponse): unknown {
    const obj: any = {};
    if (message.services) {
      obj.services = message.services.map((e) => e ? GetLogisticServicesResponse_LogisticService.toJSON(e) : undefined);
    } else {
      obj.services = [];
    }
    if (message.vendors) {
      obj.vendors = message.vendors.map((e) => e ? GetLogisticServicesResponse_LogisticVendor.toJSON(e) : undefined);
    } else {
      obj.vendors = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLogisticServicesResponse>, I>>(base?: I): GetLogisticServicesResponse {
    return GetLogisticServicesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLogisticServicesResponse>, I>>(object: I): GetLogisticServicesResponse {
    const message = createBaseGetLogisticServicesResponse();
    message.services = object.services?.map((e) => GetLogisticServicesResponse_LogisticService.fromPartial(e)) || [];
    message.vendors = object.vendors?.map((e) => GetLogisticServicesResponse_LogisticVendor.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetLogisticServicesResponse_LogisticService(): GetLogisticServicesResponse_LogisticService {
  return { serviceId: "", serviceName: "" };
}

export const GetLogisticServicesResponse_LogisticService = {
  encode(message: GetLogisticServicesResponse_LogisticService, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceId !== "") {
      writer.uint32(10).string(message.serviceId);
    }
    if (message.serviceName !== "") {
      writer.uint32(18).string(message.serviceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLogisticServicesResponse_LogisticService {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLogisticServicesResponse_LogisticService();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serviceId = reader.string();
          break;
        case 2:
          message.serviceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLogisticServicesResponse_LogisticService {
    return {
      serviceId: isSet(object.serviceId) ? String(object.serviceId) : "",
      serviceName: isSet(object.serviceName) ? String(object.serviceName) : "",
    };
  },

  toJSON(message: GetLogisticServicesResponse_LogisticService): unknown {
    const obj: any = {};
    message.serviceId !== undefined && (obj.serviceId = message.serviceId);
    message.serviceName !== undefined && (obj.serviceName = message.serviceName);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLogisticServicesResponse_LogisticService>, I>>(
    base?: I,
  ): GetLogisticServicesResponse_LogisticService {
    return GetLogisticServicesResponse_LogisticService.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLogisticServicesResponse_LogisticService>, I>>(
    object: I,
  ): GetLogisticServicesResponse_LogisticService {
    const message = createBaseGetLogisticServicesResponse_LogisticService();
    message.serviceId = object.serviceId ?? "";
    message.serviceName = object.serviceName ?? "";
    return message;
  },
};

function createBaseGetLogisticServicesResponse_LogisticVendor(): GetLogisticServicesResponse_LogisticVendor {
  return { vendorId: "", vendorName: "", services: "" };
}

export const GetLogisticServicesResponse_LogisticVendor = {
  encode(message: GetLogisticServicesResponse_LogisticVendor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.vendorId !== "") {
      writer.uint32(10).string(message.vendorId);
    }
    if (message.vendorName !== "") {
      writer.uint32(18).string(message.vendorName);
    }
    if (message.services !== "") {
      writer.uint32(26).string(message.services);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLogisticServicesResponse_LogisticVendor {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLogisticServicesResponse_LogisticVendor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vendorId = reader.string();
          break;
        case 2:
          message.vendorName = reader.string();
          break;
        case 3:
          message.services = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLogisticServicesResponse_LogisticVendor {
    return {
      vendorId: isSet(object.vendorId) ? String(object.vendorId) : "",
      vendorName: isSet(object.vendorName) ? String(object.vendorName) : "",
      services: isSet(object.services) ? String(object.services) : "",
    };
  },

  toJSON(message: GetLogisticServicesResponse_LogisticVendor): unknown {
    const obj: any = {};
    message.vendorId !== undefined && (obj.vendorId = message.vendorId);
    message.vendorName !== undefined && (obj.vendorName = message.vendorName);
    message.services !== undefined && (obj.services = message.services);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLogisticServicesResponse_LogisticVendor>, I>>(
    base?: I,
  ): GetLogisticServicesResponse_LogisticVendor {
    return GetLogisticServicesResponse_LogisticVendor.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLogisticServicesResponse_LogisticVendor>, I>>(
    object: I,
  ): GetLogisticServicesResponse_LogisticVendor {
    const message = createBaseGetLogisticServicesResponse_LogisticVendor();
    message.vendorId = object.vendorId ?? "";
    message.vendorName = object.vendorName ?? "";
    message.services = object.services ?? "";
    return message;
  },
};

function createBaseCreatePickupRequest(): CreatePickupRequest {
  return {
    referenceNo: "",
    originCity: "",
    destinationCity: "",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    trackingNumber: "",
    description: "",
  };
}

export const CreatePickupRequest = {
  encode(message: CreatePickupRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.referenceNo !== "") {
      writer.uint32(10).string(message.referenceNo);
    }
    if (message.originCity !== "") {
      writer.uint32(18).string(message.originCity);
    }
    if (message.destinationCity !== "") {
      writer.uint32(26).string(message.destinationCity);
    }
    if (message.senderName !== "") {
      writer.uint32(34).string(message.senderName);
    }
    if (message.senderPhone !== "") {
      writer.uint32(42).string(message.senderPhone);
    }
    if (message.senderAddress !== "") {
      writer.uint32(50).string(message.senderAddress);
    }
    if (message.receiverName !== "") {
      writer.uint32(58).string(message.receiverName);
    }
    if (message.receiverPhone !== "") {
      writer.uint32(66).string(message.receiverPhone);
    }
    if (message.receiverAddress !== "") {
      writer.uint32(74).string(message.receiverAddress);
    }
    if (message.trackingNumber !== "") {
      writer.uint32(82).string(message.trackingNumber);
    }
    if (message.description !== "") {
      writer.uint32(90).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePickupRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePickupRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.referenceNo = reader.string();
          break;
        case 2:
          message.originCity = reader.string();
          break;
        case 3:
          message.destinationCity = reader.string();
          break;
        case 4:
          message.senderName = reader.string();
          break;
        case 5:
          message.senderPhone = reader.string();
          break;
        case 6:
          message.senderAddress = reader.string();
          break;
        case 7:
          message.receiverName = reader.string();
          break;
        case 8:
          message.receiverPhone = reader.string();
          break;
        case 9:
          message.receiverAddress = reader.string();
          break;
        case 10:
          message.trackingNumber = reader.string();
          break;
        case 11:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePickupRequest {
    return {
      referenceNo: isSet(object.referenceNo) ? String(object.referenceNo) : "",
      originCity: isSet(object.originCity) ? String(object.originCity) : "",
      destinationCity: isSet(object.destinationCity) ? String(object.destinationCity) : "",
      senderName: isSet(object.senderName) ? String(object.senderName) : "",
      senderPhone: isSet(object.senderPhone) ? String(object.senderPhone) : "",
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      receiverName: isSet(object.receiverName) ? String(object.receiverName) : "",
      receiverPhone: isSet(object.receiverPhone) ? String(object.receiverPhone) : "",
      receiverAddress: isSet(object.receiverAddress) ? String(object.receiverAddress) : "",
      trackingNumber: isSet(object.trackingNumber) ? String(object.trackingNumber) : "",
      description: isSet(object.description) ? String(object.description) : "",
    };
  },

  toJSON(message: CreatePickupRequest): unknown {
    const obj: any = {};
    message.referenceNo !== undefined && (obj.referenceNo = message.referenceNo);
    message.originCity !== undefined && (obj.originCity = message.originCity);
    message.destinationCity !== undefined && (obj.destinationCity = message.destinationCity);
    message.senderName !== undefined && (obj.senderName = message.senderName);
    message.senderPhone !== undefined && (obj.senderPhone = message.senderPhone);
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.receiverName !== undefined && (obj.receiverName = message.receiverName);
    message.receiverPhone !== undefined && (obj.receiverPhone = message.receiverPhone);
    message.receiverAddress !== undefined && (obj.receiverAddress = message.receiverAddress);
    message.trackingNumber !== undefined && (obj.trackingNumber = message.trackingNumber);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePickupRequest>, I>>(base?: I): CreatePickupRequest {
    return CreatePickupRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreatePickupRequest>, I>>(object: I): CreatePickupRequest {
    const message = createBaseCreatePickupRequest();
    message.referenceNo = object.referenceNo ?? "";
    message.originCity = object.originCity ?? "";
    message.destinationCity = object.destinationCity ?? "";
    message.senderName = object.senderName ?? "";
    message.senderPhone = object.senderPhone ?? "";
    message.senderAddress = object.senderAddress ?? "";
    message.receiverName = object.receiverName ?? "";
    message.receiverPhone = object.receiverPhone ?? "";
    message.receiverAddress = object.receiverAddress ?? "";
    message.trackingNumber = object.trackingNumber ?? "";
    message.description = object.description ?? "";
    return message;
  },
};

function createBaseCreateShipmentReq(): CreateShipmentReq {
  return {
    sender: undefined,
    receiver: undefined,
    trackingNumber: "",
    description: "",
    grandTotal: 0,
    shipmentType: "",
    serviceName: "",
    isConsignment: undefined,
  };
}

export const CreateShipmentReq = {
  encode(message: CreateShipmentReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== undefined) {
      User.encode(message.sender, writer.uint32(10).fork()).ldelim();
    }
    if (message.receiver !== undefined) {
      User.encode(message.receiver, writer.uint32(18).fork()).ldelim();
    }
    if (message.trackingNumber !== "") {
      writer.uint32(26).string(message.trackingNumber);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(40).int32(message.grandTotal);
    }
    if (message.shipmentType !== "") {
      writer.uint32(50).string(message.shipmentType);
    }
    if (message.serviceName !== "") {
      writer.uint32(58).string(message.serviceName);
    }
    if (message.isConsignment !== undefined) {
      writer.uint32(64).bool(message.isConsignment);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateShipmentReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateShipmentReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = User.decode(reader, reader.uint32());
          break;
        case 2:
          message.receiver = User.decode(reader, reader.uint32());
          break;
        case 3:
          message.trackingNumber = reader.string();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.grandTotal = reader.int32();
          break;
        case 6:
          message.shipmentType = reader.string();
          break;
        case 7:
          message.serviceName = reader.string();
          break;
        case 8:
          message.isConsignment = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateShipmentReq {
    return {
      sender: isSet(object.sender) ? User.fromJSON(object.sender) : undefined,
      receiver: isSet(object.receiver) ? User.fromJSON(object.receiver) : undefined,
      trackingNumber: isSet(object.trackingNumber) ? String(object.trackingNumber) : "",
      description: isSet(object.description) ? String(object.description) : "",
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      shipmentType: isSet(object.shipmentType) ? String(object.shipmentType) : "",
      serviceName: isSet(object.serviceName) ? String(object.serviceName) : "",
      isConsignment: isSet(object.isConsignment) ? Boolean(object.isConsignment) : undefined,
    };
  },

  toJSON(message: CreateShipmentReq): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender ? User.toJSON(message.sender) : undefined);
    message.receiver !== undefined && (obj.receiver = message.receiver ? User.toJSON(message.receiver) : undefined);
    message.trackingNumber !== undefined && (obj.trackingNumber = message.trackingNumber);
    message.description !== undefined && (obj.description = message.description);
    message.grandTotal !== undefined && (obj.grandTotal = Math.round(message.grandTotal));
    message.shipmentType !== undefined && (obj.shipmentType = message.shipmentType);
    message.serviceName !== undefined && (obj.serviceName = message.serviceName);
    message.isConsignment !== undefined && (obj.isConsignment = message.isConsignment);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateShipmentReq>, I>>(base?: I): CreateShipmentReq {
    return CreateShipmentReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateShipmentReq>, I>>(object: I): CreateShipmentReq {
    const message = createBaseCreateShipmentReq();
    message.sender = (object.sender !== undefined && object.sender !== null)
      ? User.fromPartial(object.sender)
      : undefined;
    message.receiver = (object.receiver !== undefined && object.receiver !== null)
      ? User.fromPartial(object.receiver)
      : undefined;
    message.trackingNumber = object.trackingNumber ?? "";
    message.description = object.description ?? "";
    message.grandTotal = object.grandTotal ?? 0;
    message.shipmentType = object.shipmentType ?? "";
    message.serviceName = object.serviceName ?? "";
    message.isConsignment = object.isConsignment ?? undefined;
    return message;
  },
};

function createBaseUser(): User {
  return {
    name: "",
    mobileNumber: "",
    address: "",
    email: "",
    userType: "",
    city: "",
    latitude: undefined,
    longitude: undefined,
  };
}

export const User = {
  encode(message: User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.mobileNumber !== "") {
      writer.uint32(18).string(message.mobileNumber);
    }
    if (message.address !== "") {
      writer.uint32(26).string(message.address);
    }
    if (message.email !== "") {
      writer.uint32(34).string(message.email);
    }
    if (message.userType !== "") {
      writer.uint32(42).string(message.userType);
    }
    if (message.city !== "") {
      writer.uint32(50).string(message.city);
    }
    if (message.latitude !== undefined) {
      writer.uint32(58).string(message.latitude);
    }
    if (message.longitude !== undefined) {
      writer.uint32(66).string(message.longitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): User {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.mobileNumber = reader.string();
          break;
        case 3:
          message.address = reader.string();
          break;
        case 4:
          message.email = reader.string();
          break;
        case 5:
          message.userType = reader.string();
          break;
        case 6:
          message.city = reader.string();
          break;
        case 7:
          message.latitude = reader.string();
          break;
        case 8:
          message.longitude = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): User {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      mobileNumber: isSet(object.mobileNumber) ? String(object.mobileNumber) : "",
      address: isSet(object.address) ? String(object.address) : "",
      email: isSet(object.email) ? String(object.email) : "",
      userType: isSet(object.userType) ? String(object.userType) : "",
      city: isSet(object.city) ? String(object.city) : "",
      latitude: isSet(object.latitude) ? String(object.latitude) : undefined,
      longitude: isSet(object.longitude) ? String(object.longitude) : undefined,
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.mobileNumber !== undefined && (obj.mobileNumber = message.mobileNumber);
    message.address !== undefined && (obj.address = message.address);
    message.email !== undefined && (obj.email = message.email);
    message.userType !== undefined && (obj.userType = message.userType);
    message.city !== undefined && (obj.city = message.city);
    message.latitude !== undefined && (obj.latitude = message.latitude);
    message.longitude !== undefined && (obj.longitude = message.longitude);
    return obj;
  },

  create<I extends Exact<DeepPartial<User>, I>>(base?: I): User {
    return User.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.name = object.name ?? "";
    message.mobileNumber = object.mobileNumber ?? "";
    message.address = object.address ?? "";
    message.email = object.email ?? "";
    message.userType = object.userType ?? "";
    message.city = object.city ?? "";
    message.latitude = object.latitude ?? undefined;
    message.longitude = object.longitude ?? undefined;
    return message;
  },
};

function createBaseCreatePickupForAccessoriesRequest(): CreatePickupForAccessoriesRequest {
  return {
    referenceNo: "",
    originCity: "",
    destinationCity: "",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    trackingNumber: "",
    description: "",
    skudetails: [],
  };
}

export const CreatePickupForAccessoriesRequest = {
  encode(message: CreatePickupForAccessoriesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.referenceNo !== "") {
      writer.uint32(10).string(message.referenceNo);
    }
    if (message.originCity !== "") {
      writer.uint32(18).string(message.originCity);
    }
    if (message.destinationCity !== "") {
      writer.uint32(26).string(message.destinationCity);
    }
    if (message.senderName !== "") {
      writer.uint32(34).string(message.senderName);
    }
    if (message.senderPhone !== "") {
      writer.uint32(42).string(message.senderPhone);
    }
    if (message.senderAddress !== "") {
      writer.uint32(50).string(message.senderAddress);
    }
    if (message.receiverName !== "") {
      writer.uint32(58).string(message.receiverName);
    }
    if (message.receiverPhone !== "") {
      writer.uint32(66).string(message.receiverPhone);
    }
    if (message.receiverAddress !== "") {
      writer.uint32(74).string(message.receiverAddress);
    }
    if (message.trackingNumber !== "") {
      writer.uint32(82).string(message.trackingNumber);
    }
    if (message.description !== "") {
      writer.uint32(90).string(message.description);
    }
    for (const v of message.skudetails) {
      SkuDetails.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePickupForAccessoriesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePickupForAccessoriesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.referenceNo = reader.string();
          break;
        case 2:
          message.originCity = reader.string();
          break;
        case 3:
          message.destinationCity = reader.string();
          break;
        case 4:
          message.senderName = reader.string();
          break;
        case 5:
          message.senderPhone = reader.string();
          break;
        case 6:
          message.senderAddress = reader.string();
          break;
        case 7:
          message.receiverName = reader.string();
          break;
        case 8:
          message.receiverPhone = reader.string();
          break;
        case 9:
          message.receiverAddress = reader.string();
          break;
        case 10:
          message.trackingNumber = reader.string();
          break;
        case 11:
          message.description = reader.string();
          break;
        case 12:
          message.skudetails.push(SkuDetails.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePickupForAccessoriesRequest {
    return {
      referenceNo: isSet(object.referenceNo) ? String(object.referenceNo) : "",
      originCity: isSet(object.originCity) ? String(object.originCity) : "",
      destinationCity: isSet(object.destinationCity) ? String(object.destinationCity) : "",
      senderName: isSet(object.senderName) ? String(object.senderName) : "",
      senderPhone: isSet(object.senderPhone) ? String(object.senderPhone) : "",
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      receiverName: isSet(object.receiverName) ? String(object.receiverName) : "",
      receiverPhone: isSet(object.receiverPhone) ? String(object.receiverPhone) : "",
      receiverAddress: isSet(object.receiverAddress) ? String(object.receiverAddress) : "",
      trackingNumber: isSet(object.trackingNumber) ? String(object.trackingNumber) : "",
      description: isSet(object.description) ? String(object.description) : "",
      skudetails: Array.isArray(object?.skudetails) ? object.skudetails.map((e: any) => SkuDetails.fromJSON(e)) : [],
    };
  },

  toJSON(message: CreatePickupForAccessoriesRequest): unknown {
    const obj: any = {};
    message.referenceNo !== undefined && (obj.referenceNo = message.referenceNo);
    message.originCity !== undefined && (obj.originCity = message.originCity);
    message.destinationCity !== undefined && (obj.destinationCity = message.destinationCity);
    message.senderName !== undefined && (obj.senderName = message.senderName);
    message.senderPhone !== undefined && (obj.senderPhone = message.senderPhone);
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.receiverName !== undefined && (obj.receiverName = message.receiverName);
    message.receiverPhone !== undefined && (obj.receiverPhone = message.receiverPhone);
    message.receiverAddress !== undefined && (obj.receiverAddress = message.receiverAddress);
    message.trackingNumber !== undefined && (obj.trackingNumber = message.trackingNumber);
    message.description !== undefined && (obj.description = message.description);
    if (message.skudetails) {
      obj.skudetails = message.skudetails.map((e) => e ? SkuDetails.toJSON(e) : undefined);
    } else {
      obj.skudetails = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePickupForAccessoriesRequest>, I>>(
    base?: I,
  ): CreatePickupForAccessoriesRequest {
    return CreatePickupForAccessoriesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreatePickupForAccessoriesRequest>, I>>(
    object: I,
  ): CreatePickupForAccessoriesRequest {
    const message = createBaseCreatePickupForAccessoriesRequest();
    message.referenceNo = object.referenceNo ?? "";
    message.originCity = object.originCity ?? "";
    message.destinationCity = object.destinationCity ?? "";
    message.senderName = object.senderName ?? "";
    message.senderPhone = object.senderPhone ?? "";
    message.senderAddress = object.senderAddress ?? "";
    message.receiverName = object.receiverName ?? "";
    message.receiverPhone = object.receiverPhone ?? "";
    message.receiverAddress = object.receiverAddress ?? "";
    message.trackingNumber = object.trackingNumber ?? "";
    message.description = object.description ?? "";
    message.skudetails = object.skudetails?.map((e) => SkuDetails.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreatePickupResponse(): CreatePickupResponse {
  return { awbNo: "" };
}

export const CreatePickupResponse = {
  encode(message: CreatePickupResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.awbNo !== "") {
      writer.uint32(10).string(message.awbNo);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePickupResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePickupResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.awbNo = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePickupResponse {
    return { awbNo: isSet(object.awbNo) ? String(object.awbNo) : "" };
  },

  toJSON(message: CreatePickupResponse): unknown {
    const obj: any = {};
    message.awbNo !== undefined && (obj.awbNo = message.awbNo);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePickupResponse>, I>>(base?: I): CreatePickupResponse {
    return CreatePickupResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreatePickupResponse>, I>>(object: I): CreatePickupResponse {
    const message = createBaseCreatePickupResponse();
    message.awbNo = object.awbNo ?? "";
    return message;
  },
};

function createBaseCreateShipmentResponse(): CreateShipmentResponse {
  return { trackingNumber: "" };
}

export const CreateShipmentResponse = {
  encode(message: CreateShipmentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.trackingNumber !== "") {
      writer.uint32(10).string(message.trackingNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateShipmentResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateShipmentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.trackingNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateShipmentResponse {
    return { trackingNumber: isSet(object.trackingNumber) ? String(object.trackingNumber) : "" };
  },

  toJSON(message: CreateShipmentResponse): unknown {
    const obj: any = {};
    message.trackingNumber !== undefined && (obj.trackingNumber = message.trackingNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateShipmentResponse>, I>>(base?: I): CreateShipmentResponse {
    return CreateShipmentResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateShipmentResponse>, I>>(object: I): CreateShipmentResponse {
    const message = createBaseCreateShipmentResponse();
    message.trackingNumber = object.trackingNumber ?? "";
    return message;
  },
};

function createBaseGetPickupStatusRequest(): GetPickupStatusRequest {
  return { awbNo: [], isDelivered: false };
}

export const GetPickupStatusRequest = {
  encode(message: GetPickupStatusRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.awbNo) {
      writer.uint32(10).string(v!);
    }
    if (message.isDelivered === true) {
      writer.uint32(16).bool(message.isDelivered);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPickupStatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPickupStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.awbNo.push(reader.string());
          break;
        case 2:
          message.isDelivered = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPickupStatusRequest {
    return {
      awbNo: Array.isArray(object?.awbNo) ? object.awbNo.map((e: any) => String(e)) : [],
      isDelivered: isSet(object.isDelivered) ? Boolean(object.isDelivered) : false,
    };
  },

  toJSON(message: GetPickupStatusRequest): unknown {
    const obj: any = {};
    if (message.awbNo) {
      obj.awbNo = message.awbNo.map((e) => e);
    } else {
      obj.awbNo = [];
    }
    message.isDelivered !== undefined && (obj.isDelivered = message.isDelivered);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPickupStatusRequest>, I>>(base?: I): GetPickupStatusRequest {
    return GetPickupStatusRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPickupStatusRequest>, I>>(object: I): GetPickupStatusRequest {
    const message = createBaseGetPickupStatusRequest();
    message.awbNo = object.awbNo?.map((e) => e) || [];
    message.isDelivered = object.isDelivered ?? false;
    return message;
  },
};

function createBaseSkuDetails(): SkuDetails {
  return { sku: "", description: "", cod: "", piece: "", weight: "" };
}

export const SkuDetails = {
  encode(message: SkuDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sku !== "") {
      writer.uint32(10).string(message.sku);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.cod !== "") {
      writer.uint32(26).string(message.cod);
    }
    if (message.piece !== "") {
      writer.uint32(34).string(message.piece);
    }
    if (message.weight !== "") {
      writer.uint32(42).string(message.weight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SkuDetails {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSkuDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sku = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.cod = reader.string();
          break;
        case 4:
          message.piece = reader.string();
          break;
        case 5:
          message.weight = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SkuDetails {
    return {
      sku: isSet(object.sku) ? String(object.sku) : "",
      description: isSet(object.description) ? String(object.description) : "",
      cod: isSet(object.cod) ? String(object.cod) : "",
      piece: isSet(object.piece) ? String(object.piece) : "",
      weight: isSet(object.weight) ? String(object.weight) : "",
    };
  },

  toJSON(message: SkuDetails): unknown {
    const obj: any = {};
    message.sku !== undefined && (obj.sku = message.sku);
    message.description !== undefined && (obj.description = message.description);
    message.cod !== undefined && (obj.cod = message.cod);
    message.piece !== undefined && (obj.piece = message.piece);
    message.weight !== undefined && (obj.weight = message.weight);
    return obj;
  },

  create<I extends Exact<DeepPartial<SkuDetails>, I>>(base?: I): SkuDetails {
    return SkuDetails.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SkuDetails>, I>>(object: I): SkuDetails {
    const message = createBaseSkuDetails();
    message.sku = object.sku ?? "";
    message.description = object.description ?? "";
    message.cod = object.cod ?? "";
    message.piece = object.piece ?? "";
    message.weight = object.weight ?? "";
    return message;
  },
};

function createBaseCancelShipmentRequest(): CancelShipmentRequest {
  return { trackingOrOrderId: "" };
}

export const CancelShipmentRequest = {
  encode(message: CancelShipmentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.trackingOrOrderId !== "") {
      writer.uint32(10).string(message.trackingOrOrderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelShipmentRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelShipmentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.trackingOrOrderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CancelShipmentRequest {
    return { trackingOrOrderId: isSet(object.trackingOrOrderId) ? String(object.trackingOrOrderId) : "" };
  },

  toJSON(message: CancelShipmentRequest): unknown {
    const obj: any = {};
    message.trackingOrOrderId !== undefined && (obj.trackingOrOrderId = message.trackingOrOrderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CancelShipmentRequest>, I>>(base?: I): CancelShipmentRequest {
    return CancelShipmentRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CancelShipmentRequest>, I>>(object: I): CancelShipmentRequest {
    const message = createBaseCancelShipmentRequest();
    message.trackingOrOrderId = object.trackingOrOrderId ?? "";
    return message;
  },
};

function createBaseCancelShipmentResponse(): CancelShipmentResponse {
  return { success: false, message: "" };
}

export const CancelShipmentResponse = {
  encode(message: CancelShipmentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelShipmentResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelShipmentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CancelShipmentResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: CancelShipmentResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  create<I extends Exact<DeepPartial<CancelShipmentResponse>, I>>(base?: I): CancelShipmentResponse {
    return CancelShipmentResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CancelShipmentResponse>, I>>(object: I): CancelShipmentResponse {
    const message = createBaseCancelShipmentResponse();
    message.success = object.success ?? false;
    message.message = object.message ?? "";
    return message;
  },
};

export interface LerService {
  GetCityTiers(request: GetCityTiersRequest): Promise<GetCityTiersResponse>;
  MapLogisticsServices(request: MapLogisticsServicesRequest): Promise<MapLogisticsServicesResponse>;
  GetLogisticServices(request: GetLogisticServicesRequest): Promise<GetLogisticServicesResponse>;
  CreatePickup(request: CreatePickupRequest): Promise<CreatePickupResponse>;
  CreateShipment(request: CreateShipmentReq): Promise<CreateShipmentResponse>;
  GetPickupStatus(request: GetPickupStatusRequest): Promise<GetPickupStatusRequest>;
  CreatePickUpForAccessories(request: CreatePickupForAccessoriesRequest): Promise<CreatePickupResponse>;
  CancelShipment(request: CancelShipmentRequest): Promise<CancelShipmentResponse>;
}

export class LerServiceClientImpl implements LerService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "ler.LerService";
    this.rpc = rpc;
    this.GetCityTiers = this.GetCityTiers.bind(this);
    this.MapLogisticsServices = this.MapLogisticsServices.bind(this);
    this.GetLogisticServices = this.GetLogisticServices.bind(this);
    this.CreatePickup = this.CreatePickup.bind(this);
    this.CreateShipment = this.CreateShipment.bind(this);
    this.GetPickupStatus = this.GetPickupStatus.bind(this);
    this.CreatePickUpForAccessories = this.CreatePickUpForAccessories.bind(this);
    this.CancelShipment = this.CancelShipment.bind(this);
  }
  GetCityTiers(request: GetCityTiersRequest): Promise<GetCityTiersResponse> {
    const data = GetCityTiersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCityTiers", data);
    return promise.then((data) => GetCityTiersResponse.decode(new _m0.Reader(data)));
  }

  MapLogisticsServices(request: MapLogisticsServicesRequest): Promise<MapLogisticsServicesResponse> {
    const data = MapLogisticsServicesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "MapLogisticsServices", data);
    return promise.then((data) => MapLogisticsServicesResponse.decode(new _m0.Reader(data)));
  }

  GetLogisticServices(request: GetLogisticServicesRequest): Promise<GetLogisticServicesResponse> {
    const data = GetLogisticServicesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetLogisticServices", data);
    return promise.then((data) => GetLogisticServicesResponse.decode(new _m0.Reader(data)));
  }

  CreatePickup(request: CreatePickupRequest): Promise<CreatePickupResponse> {
    const data = CreatePickupRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreatePickup", data);
    return promise.then((data) => CreatePickupResponse.decode(new _m0.Reader(data)));
  }

  CreateShipment(request: CreateShipmentReq): Promise<CreateShipmentResponse> {
    const data = CreateShipmentReq.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateShipment", data);
    return promise.then((data) => CreateShipmentResponse.decode(new _m0.Reader(data)));
  }

  GetPickupStatus(request: GetPickupStatusRequest): Promise<GetPickupStatusRequest> {
    const data = GetPickupStatusRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPickupStatus", data);
    return promise.then((data) => GetPickupStatusRequest.decode(new _m0.Reader(data)));
  }

  CreatePickUpForAccessories(request: CreatePickupForAccessoriesRequest): Promise<CreatePickupResponse> {
    const data = CreatePickupForAccessoriesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreatePickUpForAccessories", data);
    return promise.then((data) => CreatePickupResponse.decode(new _m0.Reader(data)));
  }

  CancelShipment(request: CancelShipmentRequest): Promise<CancelShipmentResponse> {
    const data = CancelShipmentRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CancelShipment", data);
    return promise.then((data) => CancelShipmentResponse.decode(new _m0.Reader(data)));
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
