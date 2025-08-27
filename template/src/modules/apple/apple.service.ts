import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { Model } from 'mongoose';
import { CreateAppleDto } from '@src/modules/apple/dto/create-apple.dto';
import { Apple, AppleDocument } from '@src/modules/apple/schemas/apple.schema';

@Injectable()
export class AppleService {
  constructor(
    @InjectModel(Apple.name)
    private readonly model: Model<AppleDocument>,
  ) {}

  async findAll({ offset, limit, search }): Promise<PaginatedDto<Apple>> {
    const matchCondition: any = search ? { $text: { $search: search } } : {};
    const apples = await this.model
      .find(matchCondition)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: 1 })
      .exec();

    const count = await this.model.count(matchCondition).exec();

    return {
      items: apples,
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async create(createAppleDto: CreateAppleDto): Promise<AppleDocument> {
    return this.model.create(createAppleDto);
  }
}
