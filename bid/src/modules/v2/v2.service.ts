import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  V2ServiceClient,
  V2_PACKAGE_NAME,
  UpdateHighestBidRequest,
  UpdateHighestBidResponse,
  GetMarketPriceByVariantIdRequest,
  GetMarketPriceByVariantIdResponse,
  GetUserRequest,
  GetUserResponse,
  GetProductsRequest,
  GetProductsResponse,
  GetProductStatusesRequest,
  GetProductStatusesResponse,
  GetUsersRequest,
  GetUsersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetBidSummaryRequest,
  BreakDownResponse,
  BidProduct,
  GetBidSummaryResponse,
} from '@modules/grpc/proto/v2.pb';

export interface GetBidBasicSummaryResponse {
  product: BidProduct;
  commissionSummary: BreakDownResponse;
}
@Injectable()
export class V2Service implements OnModuleInit {
  private service: V2ServiceClient;
  constructor(
    @Inject(V2_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<V2ServiceClient>('V2Service');
  }

  async updateHighestBid(
    payload: UpdateHighestBidRequest,
  ): Promise<UpdateHighestBidResponse> {
    return firstValueFrom(this.service.updateHighestBid(payload), {
      defaultValue: null,
    });
  }

  async getMarketPriceByVariantId(
    payload: GetMarketPriceByVariantIdRequest,
  ): Promise<GetMarketPriceByVariantIdResponse> {
    return firstValueFrom(this.service.getMarketPriceByVariantId(payload), {
      defaultValue: null,
    });
  }

  async getProducts(payload: GetProductsRequest): Promise<GetProductsResponse> {
    if (payload.productIds.length < 1) return { products: [] };
    return firstValueFrom(this.service.getProducts(payload), {
      defaultValue: null,
    });
  }

  async getUser(payload: GetUserRequest): Promise<GetUserResponse> {
    return firstValueFrom(this.service.getUser(payload), {
      defaultValue: null,
    });
  }

  async getProductStatuses(
    payload: GetProductStatusesRequest,
  ): Promise<GetProductStatusesResponse> {
    return firstValueFrom(this.service.getProductStatuses(payload), {
      defaultValue: null,
    });
  }
  async getUsers(payload: GetUsersRequest): Promise<GetUsersResponse> {
    return firstValueFrom(this.service.getUsers(payload), {
      defaultValue: null,
    });
  }
  async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return firstValueFrom(this.service.createOrder(payload), {
      defaultValue: null,
    });
  }

  async getBidPaymentSummaries(
    payload: GetBidSummaryRequest,
  ): Promise<GetBidSummaryResponse> {
    return firstValueFrom(this.service.getBidSummary(payload), {
      defaultValue: null,
    });
  }

  async getBidSummaryForOne(
    payload: GetBidSummaryRequest,
  ): Promise<GetBidBasicSummaryResponse> {
    const { commissionSummaries, product } = await firstValueFrom(
      this.service.getBidSummary(payload),
      {
        defaultValue: null,
      },
    );
    return {
      product: product,
      commissionSummary: commissionSummaries.length
        ? commissionSummaries[0]
        : null,
    } as GetBidBasicSummaryResponse;
  }
}
