import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ReviewService } from '../review/review.service';
import {
  GetRatingSellerRequest,
  GetResponseOfProductRequest,
  GetResponseOfProductResponse,
  REVIEW_SERVICE_NAME,
  Response,
} from './proto/review.pb';
import { ResponseService } from '../question/response.service';

@Controller('/')
export class GRPCController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly responseService: ResponseService,
  ) {}

  @GrpcMethod(REVIEW_SERVICE_NAME, 'GetRatingSeller')
  async GetRatingSeller(payload: GetRatingSellerRequest) {
    const rating = await this.reviewService.getRatingReviewee(payload.sellerId);
    return { stars: rating.stars };
  }

  @GrpcMethod(REVIEW_SERVICE_NAME, 'GetResponsesOfProduct')
  async GetResponsesOfProduct(
    payload: GetResponseOfProductRequest,
  ): Promise<GetResponseOfProductResponse> {
    const result = await this.responseService.getProductResponse(
      payload.productId,
    );

    return {
      id: result[0]?._id || '',
      userId: result[0]?.userId || '',
      productId: result[0]?.productId || '',
      score: result[0]?.score || 0,
      responses: (result[0]?.responses as Response[]) || [],
    };
  }
}
