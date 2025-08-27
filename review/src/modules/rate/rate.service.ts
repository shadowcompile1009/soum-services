import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rate, RateDocument } from './schemas/rate.schema';
import { Model } from 'mongoose';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RateService {
  constructor(
    @InjectModel(Rate.name)
    private readonly rate: Model<RateDocument>,
  ) {}

  async upsert(updateRateDto: UpdateRateDto) {
    return this.rate
      .findOneAndUpdate(
        { revieweeId: updateRateDto.revieweeId },
        {
          $set: {
            count: updateRateDto.count,
            rate: updateRateDto.rate,
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true },
      )
      .exec();
  }

  findByReviewee(id: string): Promise<Rate> {
    return this.rate.findOne({ revieweeId: id }).exec();
  }
}
