/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "v2";

export interface GetOrderDetailResponse {
  buyerId: string;
  sellerId: string;
  sellerOrderDetail: SellerOrderDetail | undefined;
  buyerOrderDetail: BuyerOrderDetail | undefined;
  productName: string;
  orderNumber: string;
  orderId: string;
  productId: string;
  sellerPhoneNumber: string;
}

export interface GetOrderDetailRequest {
  orderId: string;
}

export interface GetUserRequest {
  id: string;
}

export interface GetDmUserRequest {
  userId: string;
}

export interface GetPermissionsRequest {
  serviceName: string;
}

export interface GetUserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  bankDetail: Bank | undefined;
  address: Address | undefined;
}

export interface GetDmUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  status: string;
  email: string;
  phoneNumber: string;
}

export interface SellerOrderDetail {
  payoutAmount: number;
  sellPrice: number;
}

export interface BuyerOrderDetail {
  grandTotal: number;
}

export interface Bank {
  accountHolderName: string;
  accountId: string;
  bankBIC: string;
  bankName: string;
}

export interface Address {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

export interface Permission {
  key: string;
  description: string;
}

export interface GetUsersRequest {
  userIds: string[];
}

export interface GetPermissionsResponse {
  permissions: Permission[];
}

export interface GetUsersResponse {
  users: GetUsersResponse_User[];
}

export interface GetUsersResponse_User {
  id: string;
  name: string;
  phoneNumber: string;
  bankDetail: Bank | undefined;
}

export interface GetDmUsersRequest {
  userIds: string[];
}

export interface GetDmUsersResponse {
  users: GetDmUsersResponse_DmUser[];
}

export interface GetDmUsersResponse_DmUser {
  id: string;
  username: string;
  phoneNumber: string;
}

export interface GetUsersByPhoneRequest {
  phoneNumber: string;
}

export interface GetUsersByPhoneResponse {
  users: GetUsersByPhoneResponse_User[];
}

export interface GetUsersByPhoneResponse_User {
  id: string;
  name: string;
  phoneNumber: string;
  bankDetail: Bank | undefined;
}

export interface UpdateHighestBidRequest {
  productId: string;
  bid: number;
}

export interface UpdateHighestBidResponse {
}

export interface GetProductsRequest {
  productIds: string[];
}

export interface GetProductsResponse {
  products: GetProductsResponse_Product[];
}

export interface GetProductsResponse_Product {
  productId: string;
  sellerId: string;
  productName: string;
  startBid: number;
  sellerName: string;
  productNameAr: string;
  commission: number;
  shipping: number;
  availablePayment: string;
  isExpired: boolean;
  vat: number;
  productImg: string;
  isDeleted: boolean;
  isSold: boolean;
}

export interface GetMarketPriceByVariantIdRequest {
  variantId: string;
  grade: string;
}

export interface GetMarketPriceByVariantIdResponse {
  marketPrice: number;
}

export interface CreateOrderRequest {
  productId: string;
  paymentType: string;
  paymentProvider: string;
  userId: string;
  amount: number;
  soumTransactionNumber: string;
  clientType: string;
}

export interface CreateOrderResponse {
  orderId: string;
  dmOrderId: string;
}

export interface GetProductStatusesRequest {
  productId: string;
}

export interface GetProductStatusesResponse {
  deleted: boolean;
  expired: boolean;
  sold: boolean;
}

export interface UpdateLogisticServiceRequest {
  serviceId: string;
  vendorId: string;
  dmoId: string;
}

export interface UpdateLogisticServiceResponse {
}

export const V2_PACKAGE_NAME = "v2";

export interface V2ServiceClient {
  getUser(request: GetUserRequest): Observable<GetUserResponse>;

  getUsers(request: GetUsersRequest): Observable<GetUsersResponse>;

  getPermissions(request: GetPermissionsRequest): Observable<GetPermissionsResponse>;

  getOrderDetail(request: GetOrderDetailRequest): Observable<GetOrderDetailResponse>;

  getDmUser(request: GetDmUserRequest): Observable<GetDmUserResponse>;

  getDmUsers(request: GetDmUsersRequest): Observable<GetDmUsersResponse>;

  getUsersByPhone(request: GetUsersByPhoneRequest): Observable<GetUsersByPhoneResponse>;

  updateHighestBid(request: UpdateHighestBidRequest): Observable<UpdateHighestBidResponse>;

  getProducts(request: GetProductsRequest): Observable<GetProductsResponse>;

  getMarketPriceByVariantId(request: GetMarketPriceByVariantIdRequest): Observable<GetMarketPriceByVariantIdResponse>;

  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse>;

  getProductStatuses(request: GetProductStatusesRequest): Observable<GetProductStatusesResponse>;

  updateLogisticService(request: UpdateLogisticServiceRequest): Observable<UpdateLogisticServiceResponse>;
}

export interface V2ServiceController {
  getUser(request: GetUserRequest): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;

  getUsers(request: GetUsersRequest): Promise<GetUsersResponse> | Observable<GetUsersResponse> | GetUsersResponse;

  getPermissions(
    request: GetPermissionsRequest,
  ): Promise<GetPermissionsResponse> | Observable<GetPermissionsResponse> | GetPermissionsResponse;

  getOrderDetail(
    request: GetOrderDetailRequest,
  ): Promise<GetOrderDetailResponse> | Observable<GetOrderDetailResponse> | GetOrderDetailResponse;

  getDmUser(request: GetDmUserRequest): Promise<GetDmUserResponse> | Observable<GetDmUserResponse> | GetDmUserResponse;

  getDmUsers(
    request: GetDmUsersRequest,
  ): Promise<GetDmUsersResponse> | Observable<GetDmUsersResponse> | GetDmUsersResponse;

  getUsersByPhone(
    request: GetUsersByPhoneRequest,
  ): Promise<GetUsersByPhoneResponse> | Observable<GetUsersByPhoneResponse> | GetUsersByPhoneResponse;

  updateHighestBid(
    request: UpdateHighestBidRequest,
  ): Promise<UpdateHighestBidResponse> | Observable<UpdateHighestBidResponse> | UpdateHighestBidResponse;

  getProducts(
    request: GetProductsRequest,
  ): Promise<GetProductsResponse> | Observable<GetProductsResponse> | GetProductsResponse;

  getMarketPriceByVariantId(
    request: GetMarketPriceByVariantIdRequest,
  ):
    | Promise<GetMarketPriceByVariantIdResponse>
    | Observable<GetMarketPriceByVariantIdResponse>
    | GetMarketPriceByVariantIdResponse;

  createOrder(
    request: CreateOrderRequest,
  ): Promise<CreateOrderResponse> | Observable<CreateOrderResponse> | CreateOrderResponse;

  getProductStatuses(
    request: GetProductStatusesRequest,
  ): Promise<GetProductStatusesResponse> | Observable<GetProductStatusesResponse> | GetProductStatusesResponse;

  updateLogisticService(
    request: UpdateLogisticServiceRequest,
  ): Promise<UpdateLogisticServiceResponse> | Observable<UpdateLogisticServiceResponse> | UpdateLogisticServiceResponse;
}

export function V2ServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUser",
      "getUsers",
      "getPermissions",
      "getOrderDetail",
      "getDmUser",
      "getDmUsers",
      "getUsersByPhone",
      "updateHighestBid",
      "getProducts",
      "getMarketPriceByVariantId",
      "createOrder",
      "getProductStatuses",
      "updateLogisticService",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("V2Service", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("V2Service", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const V2_SERVICE_NAME = "V2Service";
