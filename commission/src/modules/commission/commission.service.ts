import { BadRequestException, Injectable } from '@nestjs/common';
import { Commission, CommissionDocument } from './schemas/commission.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Document } from 'mongoose';
import { CommissionDto } from 'src/modules/commission/dto/createCommission.dto';
import { isEqual } from 'lodash';
import { Status } from 'src/modules/commission/enum/status.enum';
import { PaginatedDto } from 'src/dto/paginated.dto';
import {
  ActionType,
  CommissionEventLogRequest,
  createEventLog,
} from 'src/utils/activitylogs.util';
import { CommissionModuleType } from './enum/commissionModuleType';
import { CommissionType } from './enum/commissionType.enum';
import { UserType } from './enum/userSellerType.enum';
import { CommissionCalculationService } from '../product-commission/commission-calculation.service';
@Injectable()
export class CommissionService {
  constructor(
    @InjectModel(Commission.name)
    private readonly model: Model<CommissionDocument>,
    private readonly calculeteCommissionService: CommissionCalculationService,
  ) {}

  async findAll({
    offset = 0,
    limit = 100,
    userType,
    isBuyer,
    categoryId,
  }): Promise<PaginatedDto<CommissionDto>> {
    const data = await this.model
      .find({
        userType: userType,
        isBuyer: isBuyer,
        // categoryId: categoryId,
        status: { $ne: Status.DELETED },
      })
      .skip(offset)
      .limit(limit)
      .exec();
    return {
      limit: limit,
      offset: offset,
      items: (data || []).map((elem) => elem as CommissionDto),
    } as PaginatedDto<CommissionDto>;
  }

  async create(
    createCommissionDto: CommissionDto,
    userName: string,
  ): Promise<CommissionDto> {
    this.validateNeedParams(createCommissionDto);
    // to be removed for now as @meshal asked
    // if (CommissionType.PRICE_QUALITY === createCommissionDto.type) {
    //   const data = await this.model.find({
    //     userType: createCommissionDto.userType,
    //     isBuyer: createCommissionDto.isBuyer,
    //     type: CommissionType.PRICE_QUALITY,
    //   });
    //   if (data?.length != 0)
    //     throw new BadRequestException('Only one PRICE_QUALITY per seller type');
    // }
    const doc = await new this.model(createCommissionDto).save();
    createEventLog({
      actionDate: new Date().toISOString(),
      actionType: ActionType.CREATED,
      commissionName: createCommissionDto.name,
      commissionModuleType: createCommissionDto.isBuyer
        ? CommissionModuleType.BUYER
        : CommissionModuleType.SELLER,
      module: 'Commission-Settings',
      userName: userName,
    } as CommissionEventLogRequest);
    return { id: doc.toObject().id, ...createCommissionDto } as CommissionDto;
  }

  async update(
    createCommissionDto: CommissionDto,
    userName: string,
  ): Promise<CommissionDto> {
    this.validateNeedParams(createCommissionDto);
    const data = await this.model.findOne({
      _id: new mongoose.Types.ObjectId(createCommissionDto.id),
    });
    const oldCommission = data instanceof Document ? data.toObject() : data;

    if (!oldCommission) throw new BadRequestException('Invalid commission id');

    // this to get whatever was there before and set the new changes
    const newCommission = {} as CommissionDocument;
    Object.assign(newCommission, oldCommission);
    Object.assign(newCommission, createCommissionDto);

    if (CommissionType.FIXED === newCommission.type)
      newCommission.minimum = newCommission.maximum;
    await this.model.updateOne(
      { _id: new mongoose.Types.ObjectId(createCommissionDto.id) },
      {
        $set: newCommission,
      },
    );
    this.createActivity(newCommission, oldCommission, userName);
    return createCommissionDto;
  }

  async remove(id: string, userName: string): Promise<void> {
    const data = await this.model.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    const oldCommission = data instanceof Document ? data.toObject() : data;
    if (CommissionType.PRICE_QUALITY === oldCommission.type)
      throw new BadRequestException(
        'you cannot delete PRICE_QUALITY commission',
      );
    await this.update(
      { id: id, status: Status.DELETED } as CommissionDto,
      userName,
    );
  }

  validateNeedParams(commission: CommissionDto) {
    if ([Status.DELETED, Status.INACTIVE].includes(commission.status)) return;

    if (commission.categoryId && commission?.modelIds?.length) 
      throw new BadRequestException('commission cannot have categoryId and modelIds at same time');
    if (
      commission.categoryId &&
      !mongoose.isValidObjectId(commission.categoryId)
    ) {
      throw new BadRequestException('Invalid/Empty categoryId format');
    }
    if (
      commission.priceRange &&
      commission.priceRange.endValue < commission.priceRange.startValue
    ) {
      throw new BadRequestException('Invalid priceRange value');
    }

    if (
      CommissionType.FIXED === commission.type &&
      (commission.minimum == null || commission.maximum == null)
    ) {
      throw new BadRequestException(
        'FIXED type should have min and max with values',
      );
    }

    if (
      CommissionType.PERCENTAGE === commission.type &&
      (commission.minimum == null ||
        commission.maximum == null ||
        commission.percentage == null ||
        commission.maximum < commission.minimum)
    ) {
      throw new BadRequestException(
        'PERCENTAGE type should have min and max with values',
      );
    }

    if (
      CommissionType.PRICE_QUALITY === commission.type &&
      (commission?.ranges?.fairPercentage == null ||
        commission?.ranges?.excellentPercentage == null ||
        commission?.ranges?.expensivePercentage == null)
    ) {
      throw new BadRequestException(
        'PRICE_QUALITY type should have fair, excellent and expensive with values',
      );
    }
  }

  createActivity(
    newCommission: CommissionDocument,
    oldCommission: CommissionDocument,
    userName: string,
  ) {
    if (isEqual(newCommission, oldCommission)) return;

    if (
      newCommission.maximum != oldCommission.maximum ||
      newCommission.name != oldCommission.name ||
      newCommission.minimum != oldCommission.minimum ||
      newCommission.percentage != oldCommission.percentage ||
      newCommission.ranges?.fairPercentage !=
        oldCommission.ranges?.fairPercentage ||
      newCommission.ranges?.excellentPercentage !=
        oldCommission.ranges?.excellentPercentage ||
      newCommission.ranges?.expensivePercentage !=
        oldCommission.ranges?.expensivePercentage
    )
      createEventLog({
        actionDate: new Date().toISOString(),
        actionType: ActionType.UPDATED,
        commissionName: newCommission.name,
        commissionModuleType: newCommission.isBuyer
          ? CommissionModuleType.BUYER
          : CommissionModuleType.SELLER,
        module: 'Commission-Settings',
        userName: userName,
      } as CommissionEventLogRequest);

    if (newCommission.status != oldCommission.status) {
      let actionType = null;
      if (Status.ACTIVE === newCommission.status)
        actionType = ActionType.ACTIVATED;
      if (Status.INACTIVE === newCommission.status)
        actionType = ActionType.INACTIVATED;
      if (Status.DELETED === newCommission.status)
        actionType = ActionType.DELETED;
      createEventLog({
        actionDate: new Date().toISOString(),
        actionType: actionType,
        commissionName: oldCommission.name,
        commissionModuleType: oldCommission.isBuyer
          ? CommissionModuleType.BUYER
          : CommissionModuleType.SELLER,
        module: 'Commission-Settings',
        userName: userName,
      } as CommissionEventLogRequest);
      return;
    }

    if (
      newCommission.status != oldCommission.status &&
      Status.ACTIVE === newCommission.status
    ) {
      createEventLog({
        actionDate: new Date().toISOString(),
        actionType: ActionType.ACTIVATED,
        commissionName: oldCommission.name,
        commissionModuleType: oldCommission.isBuyer
          ? CommissionModuleType.BUYER
          : CommissionModuleType.SELLER,
        module: 'Commission-Settings',
        userName: userName,
      } as CommissionEventLogRequest);
      return;
    }
  }

  async getSellerCommissions(params: {
    categoryId: string;
    userType: string;
  }): Promise<any> {
    const userType = params.userType;
    let filterObj: any = {
      priceRange: { $exists: false },
      ranges: { $exists: false },
      userType: { $in: [UserType.ALL_SELLERS, userType] },
      isBuyer: false,
      status: Status.ACTIVE,
    };
    const countOfCommissionByCatgory = await this.model.countDocuments({
      ...filterObj,
      ...{ categoryId: params.categoryId },
    });
    if (countOfCommissionByCatgory > 0) {
      filterObj.categoryId = params.categoryId;
    } else {
      filterObj = {
        ...filterObj,
        ...{
          $or: [
            { categoryId: params.categoryId },
            { categoryId: { $exists: false } },
            { categoryId: { $eq: null } },
          ],
        },
      };
    }
    const commissions = await this.model.find(filterObj);
    const response: { base: any; priceRange: any; priceQuality: any } = {
      base: {},
      priceRange: {},
      priceQuality: {},
    };

    const baseCommissions = this.calculeteCommissionService.calculateAnalysis(
      null,
      null,
      commissions,
      0,
    );
    response.base = baseCommissions;

    let filterObjPr: any = {
      priceRange: { $exists: true },
      isBuyer: false,
      status: Status.ACTIVE,
      userType,
    };
    if (countOfCommissionByCatgory > 0) {
      filterObjPr.categoryId = params.categoryId;
    } else {
      filterObjPr = {
        ...filterObjPr,
        ...{
          $or: [
            { categoryId: params.categoryId },
            { categoryId: { $exists: false } },
            { categoryId: { $eq: null } },
          ],
        },
      };
    }
    const priceRangeCommissions = await this.model.find(filterObjPr);
    const priceRangeMap = new Map<
      string,
      {
        commissionTotalFixed: number;
        commissionTotalPercentage: number;
        priceRange: { operator: string; startValue: number; endValue: number };
      }
    >();
    priceRangeCommissions.map((item) => {
      const key = `${item.priceRange.startValue}-${item.priceRange.endValue}`;
      if (priceRangeMap.has(key)) {
        const elem = priceRangeMap.get(key);
        if (item.type == CommissionType.FIXED)
          elem.commissionTotalFixed += item.minimum;
        if (item.type == CommissionType.PERCENTAGE)
          elem.commissionTotalPercentage += item.percentage;
        priceRangeMap.set(key, elem);
      } else {
        const elem = {
          priceRange: item.priceRange,
          commissionTotalFixed:
            item.type == CommissionType.FIXED ? item.minimum : 0,
          commissionTotalPercentage:
            item.type == CommissionType.PERCENTAGE ? item.percentage : 0,
        };
        priceRangeMap.set(key, elem);
      }
    });

    const priceRangeVals = [];
    for (const val of priceRangeMap.values()) {
      val.commissionTotalFixed += baseCommissions.commissionTotalFixed;
      val.commissionTotalPercentage +=
        baseCommissions.commissionTotalPercentage;
      priceRangeVals.push(val);
    }
    response.priceRange = priceRangeVals;

    let filterObjPq: any = {
      ranges: { $exists: true },
      isBuyer: false,
      status: Status.ACTIVE,
      userType,
    };
    if (countOfCommissionByCatgory > 0) {
      filterObjPq.categoryId = params.categoryId;
    } else {
      filterObjPq = {
        ...filterObjPq,
        ...{
          $or: [
            { categoryId: params.categoryId },
            { categoryId: { $exists: false } },
            { categoryId: { $eq: null } },
          ],
        },
      };
    }
    const priceQualityVals = [];
    const priceQualityCommissions = await this.model.find(filterObjPq);
    priceQualityCommissions.map((item) => {
      priceQualityVals.push(item.ranges);
    });
    response.priceQuality = priceQualityVals;
    return response;
  }
}
