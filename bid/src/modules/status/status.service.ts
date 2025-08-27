import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status, StatusDocument } from './schemas/status.schema';
import { CreateStatusDto } from './dto/create-status.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name)
    private readonly model: Model<StatusDocument>,
  ) {}
  async findAll(statusIds: string[] = []): Promise<StatusDocument[]> {
    const matchCondition: any =
      statusIds.length > 0
        ? {
            _id: { $in: statusIds },
          }
        : {};
    return this.model.find(matchCondition).sort({ createdAt: 1 }).exec();
  }

  async findOne(matchCondition: any): Promise<StatusDocument> {
    return await this.model.findOne(matchCondition).exec();
  }

  async create(items: CreateStatusDto[]): Promise<Status[]> {
    const foundItems = await this.model.find({
      name: { $in: items.map((item) => item.name) },
    });
    const foundItemsSet = new Set(foundItems.map((item) => item.name));

    const foundItemsMap = new Map();
    items.forEach((item) => {
      if (foundItemsSet.has(item.name)) foundItemsMap.set(item.name, item);
    });
    const newItems = items.filter((item) => !foundItemsSet.has(item.name));

    await Promise.all([
      ...[this.model.insertMany(newItems)],
      ...foundItems.map((item) =>
        this.model.findOneAndUpdate(
          { name: item.name },
          { displayName: foundItemsMap.get(item.name).displayName },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          },
        ),
      ),
    ]);
    return this.model.find().exec();
  }
}
