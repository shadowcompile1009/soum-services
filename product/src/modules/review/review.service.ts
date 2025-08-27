import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { GetRatingSellerRequest, GetRatingSellerResponse, REVIEW_PACKAGE_NAME, ReviewServiceClient } from '../grpc/proto/review.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewService implements OnModuleInit{
private service: ReviewServiceClient;
  constructor(
    @Inject(REVIEW_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<ReviewServiceClient>('ReviewService');
  }

  async getRatingSeller(
    payload: GetRatingSellerRequest,
  ): Promise<GetRatingSellerResponse> {
    return await firstValueFrom(this.service.getRatingSeller(payload), {
      defaultValue: null,
    });
  }
}
