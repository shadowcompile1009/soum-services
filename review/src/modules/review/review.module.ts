import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/auth/auth.module';
import { RateModule } from '../rate/rate.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Rate, RateSchema } from './schemas/rate.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { V2Module } from '../v2/v2.module';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature([
      { name: Rate.name, schema: RateSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    AuthModule,
    RateModule,
    V2Module,
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
