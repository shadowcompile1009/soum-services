import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Model } from 'mongoose';
import { PaginatedDto } from './dto/paginated-review.dto';
import { RateService } from '../rate/rate.service';
import { V2Service } from '../v2/v2.service';
import { BaseReviewDto } from './dto/base-review.dto';
import { GetUsersResponse_User } from '../grpc/proto/v2.pb';
import { RatingReviewDto } from './dto/update-review.dto';
import { getCustomName } from '@src/utils/helper';

export interface EnrichedReview extends Review {
  reviewerName: string;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly review: Model<ReviewDocument>,
    private readonly rateService: RateService,
    private readonly v2Service: V2Service,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review | any> {
    const review = await this.review
      .findOne({ orderId: createReviewDto.orderId })
      .exec();

    if (review) {
      return { message: 'Order is already reviewed' };
    }
    const createdReview = new this.review(createReviewDto);

    const rate = await this.rateService.findByReviewee(
      createReviewDto.revieweeId,
    );
    const newCount = rate ? rate.count + 1 : 1;
    const adjustedRate = createReviewDto.rate !== 5 
      ? parseFloat((
        createReviewDto.rate +
        (createReviewDto.rate / 5) * 1.2
      ).toFixed(2))
      : createReviewDto.rate;
    const newRating = rate
      ? (rate.rate * rate.count + adjustedRate) / newCount
      : createReviewDto.rate;

    this.rateService.upsert({
      revieweeId: createdReview.revieweeId,
      rate: parseFloat(newRating.toFixed(1)),
      count: newCount,
    });

    return createdReview.save();
  }

  async findByReviewee({
    page,
    size,
    id,
  }): Promise<PaginatedDto<BaseReviewDto>> {
    const query: any = id ? { revieweeId: id } : { rate: { $gte: 4 } };
    const reviews = await this.review
      .find(query)
      .skip((page - 1) * size)
      .limit(size)
      .sort({ rate: -1, createdAt: -1 })
      .lean()
      .exec();
    if (reviews?.length === 0) {
      return {
        items: [],
        total: 0,
        stars: 4.5,
        hasNextPage: false,
      }; 
    }
    const userIds = reviews.map((review: Review) => review.reviewerId);
    const ownersReview = await this.v2Service.getUsers({ userIds, limitUsersWithBank : false });
    const users = ownersReview?.users || [];
    const usersMap = new Map<string, string>();
    if (users.length > 0) {
      users.forEach((user: GetUsersResponse_User) => {
        usersMap.set(user.id, getCustomName(user?.name));
      });
    }
    const returnedData = await Promise.all(
      reviews.map((review: Review) => {
        if (usersMap.has(review.reviewerId)) {
          return {
            ...review,
            reviewerName: usersMap.get(review.reviewerId) ?? 'Anonymous',
          } as EnrichedReview;
        }
        return review;
      }) as EnrichedReview[]
    );
    let count = 0;
    let stars = 4.5;
    if (id && reviews?.length > 0) {
      const rating = await this.getRatingReviewee(id);
      count = rating.count;
      stars = rating.stars;
    }
    return {
      items: returnedData,
      total: count,
      stars,
      hasNextPage: id ? page * size < count : true,
    };
  }

  async findByReviewer(id) {
    return await this.review.find({ reviewerId: id }).select('orderId').exec();
  }

  async getRatingReviewee(id: string): Promise<RatingReviewDto> {
    const rate = await this.rateService.findByReviewee(id);
    const ratingStars = rate?.rate || 4.5;
    return {
      count: rate?.count,
      stars: ratingStars < 3.8 ? 3.8 : ratingStars
    };
  }
}
