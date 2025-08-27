import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  GetProductDetailsForPromoCodeValidationRequest,
  GetProductDetailsForPromoCodeValidationResponse,
  GetUserRequest,
  GetUserResponse,
  V2ServiceClient,
  V2_PACKAGE_NAME,
  ValidIDsForPromoCodeRequest,
  ValidIDsForPromoCodeResponse,
  ValidateUserUsageOfPromoCodeRequest,
  ValidateUserUsageOfPromoCodeResponse,
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

  async getUser(payload: GetUserRequest): Promise<GetUserResponse> {
    return firstValueFrom(this.service.getUser(payload), {
      defaultValue: null,
    });
  }

  async validIdsForPromoCode(
    payload: ValidIDsForPromoCodeRequest,
  ): Promise<ValidIDsForPromoCodeResponse> {
    const responseFromService =
      await firstValueFrom<ValidIDsForPromoCodeResponse>(
        this.service.validIdsForPromoCode(payload),
      );
    return {
      feeds: responseFromService.feeds || [],
      models: responseFromService.models || [],
      brands: responseFromService.brands || [],
      categories: responseFromService.categories || [],
      sellers: responseFromService.sellers || [],
    };
  }

  async getProductDetailsForPromoCodeValidation(
    payload: GetProductDetailsForPromoCodeValidationRequest,
  ): Promise<GetProductDetailsForPromoCodeValidationResponse> {
    try {
      const responseFromService =
        await firstValueFrom<GetProductDetailsForPromoCodeValidationResponse>(
          this.service.getProductDetailsForPromoCodeValidation(payload),
        );
      return responseFromService;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async validateUserUsageOfPromoCode(
    payload: ValidateUserUsageOfPromoCodeRequest,
  ): Promise<ValidateUserUsageOfPromoCodeResponse> {
    try {
      const responseFromService =
        await firstValueFrom<ValidateUserUsageOfPromoCodeResponse>(
          this.service.validateUserUsageOfPromoCode(payload),
        );
      return responseFromService;
    } catch (error) {
      console.log(error);
      return { isUsed: false };
    }
  }
}
