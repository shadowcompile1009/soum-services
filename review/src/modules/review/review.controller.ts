import { Controller, UseGuards, Get, Post, Query, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { BaseReviewDto } from './dto/base-review.dto';
import { PaginatedDto } from './dto/paginated-review.dto';

@Controller('/')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/status')
  async getStatus() {
    return { status: 'OK' };
  }

  @Post()
  @MessagePattern('createReview')
  @UseGuards(JwtAuthGuard)
  create(@Payload() createReviewDto: CreateReviewDto, @Req() request: any) {
    createReviewDto.reviewerId = request.user.userId;

    return this.reviewService.create(createReviewDto);
  }

  @Get('/user/')
  @MessagePattern('getReviewByRevieweeId')
  getReviewByRevieweeId(
    @Query() query: any,
  ): Promise<PaginatedDto<BaseReviewDto>> {
    const page = query.page || 1;
    const size = query.size || 10;
    const id = query?.id || null;
    return this.reviewService.findByReviewee({ page, size, id });
  }

  @Get('/user/reviewer/')
  @MessagePattern('getReviewByReviewerId')
  @UseGuards(JwtAuthGuard)
  getReviewByReviewerId(@Query() query: any, @Req() request: any) {
    return this.reviewService.findByReviewer(request.user.userId);
  }
}
