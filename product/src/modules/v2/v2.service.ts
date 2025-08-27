import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  GetCategoryModelsCountResponse,
  GetCountdownValInHoursRequest,
  GetCountdownValInHoursResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  GetProductForCommissionRequest,
  GetProductForCommissionResponse,
  GetProductsForProductServiceResponse,
  GetProductsRequest,
  GetProductsResponse,
  GetPromoCodeRequest,
  GetPromoCodeResponse,
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  GetVariantsRequest,
  GetViewedProductsRequest,
  GetViewedProductsResponse,
  UpdateOrderAttributeRequest,
  UpdateOrderAttributeResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  V2ServiceClient,
  V2_PACKAGE_NAME,
  ValidateSellerDetectionNudgeRequest,
  ValidateSellerDetectionNudgeResponse,
} from '@modules/grpc/proto/v2.pb';

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

  async getProductForCommission(
    payload: GetProductForCommissionRequest,
  ): Promise<GetProductForCommissionResponse> {
    return await firstValueFrom(this.service.getProductForCommission(payload), {
      defaultValue: null,
    });
  }

  async getOrderDetail(
    payload: GetOrderDetailRequest,
  ): Promise<GetOrderDetailResponse> {
    return await firstValueFrom(this.service.getOrderDetail(payload), {
      defaultValue: null,
    });
  }

  async getViewedProducts(
    payload: GetViewedProductsRequest,
  ): Promise<GetViewedProductsResponse> {
    return await firstValueFrom(this.service.getViewedProducts(payload), {
      defaultValue: null,
    });
  }

  async getProducts(payload: GetProductsRequest): Promise<GetProductsResponse> {
    return await firstValueFrom(this.service.getProducts(payload), {
      defaultValue: null,
    });
  }

  async getUser(payload: GetUserRequest): Promise<GetUserResponse> {
    return await firstValueFrom(this.service.getUser(payload), {
      defaultValue: null,
    });
  }

  async getUsers(payload: GetUsersRequest): Promise<GetUsersResponse> {
    return await firstValueFrom(this.service.getUsers(payload), {
      defaultValue: null,
    });
  }
  async validateSellerDetectionNudge(
    payload: ValidateSellerDetectionNudgeRequest,
  ): Promise<ValidateSellerDetectionNudgeResponse> {
    return await firstValueFrom(
      this.service.validateSellerDetectionNudge(payload),
      {
        defaultValue: null,
      },
    );
  }
  async getCountdownValInHours(
    payload: GetCountdownValInHoursRequest,
  ): Promise<GetCountdownValInHoursResponse> {
    return await firstValueFrom(this.service.getCountdownValInHours(payload), {
      defaultValue: null,
    });
  }

  async getProductsAsProductService(
    payload: GetProductsRequest,
  ): Promise<GetProductsForProductServiceResponse> {
    return await firstValueFrom(
      this.service.getProductsForProductService(payload),
      {
        defaultValue: null,
      },
    );
  }

  async getPromoCode(
    payload: GetPromoCodeRequest,
  ): Promise<GetPromoCodeResponse> {
    try {
      return await firstValueFrom(this.service.getPromoCode(payload), {
        defaultValue: null,
      });
    } catch (err) {
      return null;
    }
  }

  async updateOrderAttribute(
    payload: UpdateOrderAttributeRequest,
  ): Promise<UpdateOrderAttributeResponse> {
    try {
      return await firstValueFrom(this.service.updateOrderAttribute(payload), {
        defaultValue: null,
      });
    } catch (err) {
      return null;
    }
  }
  async updateProductService(
    payload: UpdateProductRequest,
  ): Promise<UpdateProductResponse | null> {
    try {
      const res = await firstValueFrom(this.service.updateProduct(payload));
      return res;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }
  async getCategoryModelsCount(
    payload: GetVariantsRequest,
  ): Promise<GetCategoryModelsCountResponse> {
    try {
      return await firstValueFrom(this.service.getCategoryModelsCount(payload), {
        defaultValue: null,
      });
    } catch (err) {
      return null;
    }
  }
}
