import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status, StatusSchemaDocument } from './schemas/status.schema';
import { CreateStatusDto } from './dto/create-status.dto';
import { CreateStatusGroupDto } from './dto/create-status-group.dto';
import {
  StatusGroup,
  StatusGroupSchemaDocument,
} from './schemas/status-group.schema';

@Injectable()
export class StatusesService {
  constructor(
    @InjectModel(Status.name)
    private readonly model: Model<StatusSchemaDocument>,
    @InjectModel(StatusGroup.name)
    private readonly statusGroupModel: Model<StatusGroupSchemaDocument>,
  ) {}

  async listAll(): Promise<StatusSchemaDocument[]> {
    return await this.model.find().exec();
  }

  async findById(id: string): Promise<StatusSchemaDocument> {
    return await this.model.findById(id).exec();
  }

  async findByName(name: string): Promise<StatusSchemaDocument> {
    return await this.model.findOne({ name }).exec();
  }

  async findByNames(names: string[]): Promise<StatusSchemaDocument[]> {
    return await this.model.find({ name: { $in: names } }).exec();
  }

  async findBySubmodule(submodule: string): Promise<StatusSchemaDocument[]> {
    return await this.model.find({ submodule }).exec();
  }

  async findByDmOrderId(dmOrderId: string): Promise<StatusSchemaDocument> {
    return await this.model.findOne({ orderId: dmOrderId }).exec();
  }

  async create(createStatusDto: CreateStatusDto[]): Promise<boolean> {
    try {
      for (const item of createStatusDto) {
        item._id = item.id;
      }
      const existingStatuses = await this.model.find({
        name: { $in: createStatusDto.map((item) => item.name) },
      });
      const statusesMap = new Map();
      createStatusDto.forEach((item) => {
        statusesMap.set(item.name, item);
      });
      const existingStatusesMap = new Map();
      existingStatuses.forEach((item) => {
        existingStatusesMap.set(item.name, item);
      });
      const newStatuses = createStatusDto.filter(
        (item) => !existingStatusesMap.has(item.name),
      );
      const items = await this.model.insertMany(newStatuses);
      let updatedStatuses = createStatusDto.filter((item) =>
        existingStatusesMap.has(item.name),
      );
      updatedStatuses = await Promise.all(
        updatedStatuses.map((item) => {
          console.log(item);
          return this.model
            .findOneAndUpdate({ name: item.name }, statusesMap.get(item.name), {
              new: true,
            })
            .exec();
        }),
      );
      return true;
    } catch (exception) {
      return false;
    }
  }

  async createStatusGroup(
    createStatusGroupDto: CreateStatusGroupDto[],
  ): Promise<boolean> {
    try {
      await Promise.all(
        createStatusGroupDto.map((item) => {
          console.log(item);
          return this.statusGroupModel.create(item);
        }),
      );
      return true;
    } catch (exception) {
      console.log(exception);
      return false;
    }
  }

  async findStatusGroupByOrderStatus(
    statusName: string,
    operatingModel: string,
    submodule: string,
  ): Promise<StatusSchemaDocument[]> {
    try {
      const statusGroups = await this.statusGroupModel
        .find({
          operatingModel,
          statusName,
          submodule,
        })
        .sort({ createdAt: -1 });
      return this.findByNames(
        statusGroups.map((group) => group.groupStatusName),
      );
    } catch (exception) {
      throw exception;
    }
  }
}
