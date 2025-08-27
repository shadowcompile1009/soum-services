import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { V2Service } from '../v2/v2.service';
import { PenaltyDto } from './dto/base-penalty.dto';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { PenaltyStatus } from './enums/penalty.status.enum';
import { Penalty, PenaltyDocument } from './schemas/penalty.schema';
import { getDataRangeAnalytics } from '@src/utils/helper';

@Injectable()
export class PenaltyService {
  constructor(
    @InjectModel(Penalty.name)
    private readonly model: Model<PenaltyDocument>,
    private readonly v2Service: V2Service,
  ) {}

  async getHoldingPenaltyBalance(
    userId: string,
    range: string = null,
  ): Promise<PenaltyDto> {
    const query: Record<string, any> = {
      userId,
      status: PenaltyStatus.ACTIVE,
      nextDmoId: undefined,
    };
    if (range) {
      const { startDate, endDate } = getDataRangeAnalytics(range);
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const penalties = await this.model.aggregate([
      { $match: query },
      {
        $group: { _id: '$userId', totalPenalty: { $sum: '$amount' } },
      },
    ]);

    return {
      userId,
      amount: penalties[0]?.totalPenalty ?? 0,
    };
  }

  async create(createPenaltyDto: CreatePenaltyDto): Promise<PenaltyDocument> {
    // block to update if there is already generated invoice
    // const { isGenerated } = await this.v2Service.getInvoiceGenerationFlag({
    //   dmoId: createPenaltyDto?.dmoId,
    // });
    // if (isGenerated) {
    //   throw new BadRequestException(
    //     'Request is rejected due to invoice generation',
    //   );
    // }
    const createdDate = new Date();
    const penalty = await this.model
      .findOneAndUpdate(
        {
          dmoId: createPenaltyDto.dmoId,
          userId: createPenaltyDto.userId,
        },
        {
          ...createPenaltyDto,
          status: PenaltyStatus.ACTIVE,
          isFulfilled: false,
          updatedAt: createdDate,
        },
        {
          new: true,
          upsert: true,
        },
      )
      .exec();
    // update is_penalized flag
    await this.v2Service.updatePenaltyFlag({
      sellerId: createPenaltyDto?.userId,
    });

    return penalty?.toJSON();
  }

  async deductHoldingPenaltyBalance(
    userId: string,
    dmoId: string = '',
  ): Promise<boolean> {
    await this.model.updateMany(
      {
        userId,
        status: PenaltyStatus.ACTIVE,
        isFulfilled: false,
        nextDmoId: undefined,
      },
      { $set: { isFulfilled: true, nextDmoId: dmoId } },
    );
    return true;
  }

  async getNewAddedPenalty(sellerId: string): Promise<PenaltyDocument> {
    const penalty = await this.model
      .findOne({
        userId: sellerId,
        status: PenaltyStatus.ACTIVE,
      })
      .sort({
        createdAt: -1,
      })
      .exec();
    return {
      userId: sellerId,
      amount: 0,
      ...penalty?.toJSON(),
    };
  }

  async getPenaltyPerDMO(dmoId: string): Promise<PenaltyDocument> {
    const penalty = await this.model
      .findOne({
        dmoId,
      })
      .exec();
    return {
      dmoId,
      amount: 0,
      ...penalty?.toJSON(),
    };
  }

  async updatePaidStatusHoldingPenaltyBalance(
    userId: string,
  ): Promise<boolean> {
    await this.model.updateMany(
      {
        userId,
        status: PenaltyStatus.ACTIVE,
        isFulfilled: true,
      },
      { $set: { status: PenaltyStatus.PAID } },
    );
    return true;
  }

  async getPenalizedOrderList(
    merchantId: string,
    range: string,
  ): Promise<PenaltyDocument[]> {
    const { startDate, endDate } = getDataRangeAnalytics(range);
    return await this.model
      .find({
        userId: merchantId,
        status: PenaltyStatus.ACTIVE,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .sort({
        createdAt: -1,
      })
      .exec();
  }
}
