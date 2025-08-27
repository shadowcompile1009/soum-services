import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import {
  GetBidSettingsRequest,
  BID_SERVICE_NAME,
  ClearExpiredProductBidsRequest,
  ClearExpiredProductBidsResponse,
  TransactionUpdateRequest,
  TransactionUpdateResponse,
  GetOfferForProductRequest,
  GetOfferCountOfUserRequest,
} from './proto/bid.pb';
import { BidSettingsService } from '../bid-settings/bid-settings.service';
import { BidService } from '../bid/bid.service';
import { OfferService } from '../offer/offer.service';

@Controller('grpc')
export class GrpcController {
  private readonly logger = new Logger(BidSettingsService.name);

  constructor(
    private readonly bidSettingsService: BidSettingsService,
    private readonly bidService: BidService,
    private readonly offerService: OfferService,
  ) {}

  @GrpcMethod(BID_SERVICE_NAME, 'GetBidSettings')
  async getBidSettings(payload: GetBidSettingsRequest) {
    try {
      this.logger.log(payload);
      const bidSettings = await this.bidSettingsService.getBidSettings();
      return {
        ...bidSettings,
        config: bidSettings?.config ? JSON.stringify(bidSettings.config) : null,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  @GrpcMethod(BID_SERVICE_NAME, 'ClearExpiredProductBids')
  async clearExpiredProductBids(
    payload: ClearExpiredProductBidsRequest,
  ): Promise<ClearExpiredProductBidsResponse> {
    await this.bidService.clearExpiredBids({ productIds: payload.productIds });
    return;
  }

  @GrpcMethod(BID_SERVICE_NAME, 'TransactionUpdate')
  async transactionUpdate(
    payload: TransactionUpdateRequest,
  ): Promise<TransactionUpdateResponse> {
    try {
      return await this.bidService.updateBidAfterCheckOut({
        transactionId: payload.transactionId,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  @GrpcMethod(BID_SERVICE_NAME, 'GetOfferForProduct')
  async getOfferForProduct(payload: GetOfferForProductRequest) {
    try {
      return this.offerService.getOfferForUserInProduct(payload);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @GrpcMethod(BID_SERVICE_NAME, 'GetOfferCountOfUser')
  async getOfferCount(payload: GetOfferCountOfUserRequest) {
    try {
      return {
        count: await this.offerService.getCurrentUserOffersCount(
          payload.userId,
        ),
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
