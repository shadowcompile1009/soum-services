import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Condition } from './entities/condition';
import { ConditionRepository } from './condition.repository';
import { ConditionDto, ConditionForCsv } from './dto/condition.dto';
import { Status } from './enums/status.enum';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { CategoryConditionService } from '../category-condition/category-condition.service';
import { AmazonService } from '@src/modules/condition/upload-image.aws';
import { v4 as uuidv4 } from 'uuid';
import { V2Service } from '../v2/v2.service';
import {
  ActionType,
  ConditionEventLogRequest,
  createEventLog,
} from '@src/utils/conditionActivityLogs.util';
import { getCache, setCache } from '@src/utils/redis';
import _isEmpty from 'lodash/isEmpty';
import { BannerLang } from './enums/lang.enum';
import { BannerSource } from './enums/banner-source.enum';
import { BullMQService, Queues } from '@src/utils/bullMQ.service';

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition)
    private repo: ConditionRepository,
    readonly categoryConditionService: CategoryConditionService,
    readonly amazonService: AmazonService,
    readonly v2Service: V2Service,
  ) {}

  async getList(
    filterDto: {
      categoryId?: string;
      isPreset?: boolean;
      ids?: string[];
    },
    offset: number,
    limit: number,
  ): Promise<PaginatedDto<ConditionDto>> {
    const filterObject: any = {};

    if (filterDto.categoryId) filterObject.categoryId = filterDto.categoryId;

    if (filterDto.isPreset) filterObject.isPreset = true;

    if ((filterDto.ids || []).length) filterObject.id = { $in: filterDto.ids };

    const result = await this.repo.findAndCount(
      { ...filterObject, status: Status.ACTIVE },
      {
        limit,
        offset,
        orderBy: {
          createdAt: 1,
        },
      },
    );
    return {
      items: result[0] || [],
      offset,
      limit,
      total: result[1] || 0,
    } as PaginatedDto<ConditionDto>;
  }

  async getById(id: string): Promise<ConditionDto> {
    const key = `condition_${id}`;
    let cachedCondition = await getCache(key);
    if (!_isEmpty(cachedCondition)) {
      return cachedCondition as ConditionDto;
    }
    cachedCondition = await this.repo.findOne({ id: id });
    if (!cachedCondition) return null;
    setCache(key, cachedCondition, 60 * 60);
    return cachedCondition as ConditionDto;
  }

  async getByName(
    conditionName: string,
    categoryId: string,
  ): Promise<ConditionDto> {
    const key = `condition_${conditionName}_${categoryId}`;
    let cachedCondition = await getCache(key);
    if (!_isEmpty(cachedCondition)) {
      return cachedCondition as ConditionDto;
    }
    cachedCondition = await this.repo.findOne({
      name: conditionName,
      categoryId,
    });
    if (!cachedCondition) return null;
    setCache(key, cachedCondition, 60 * 60);
    return cachedCondition as ConditionDto;
  }

  async create(condition: ConditionDto): Promise<ConditionDto> {
    // validate the condition is not inserted 2 times on DB LEVEL if can
    this.validateNeedParams(condition);
    const conditionRow = this.repo.create(condition);
    await this.repo.getEntityManager().persistAndFlush(conditionRow);

    this.categoryConditionService.AddNewCategoryConditions(conditionRow);

    // cache needed data cuz we will have a lot of read request
    const key = `condition_${conditionRow.id}`;
    setCache(key, condition, 60 * 60);

    condition.id = conditionRow?.id;
    // send kafka event
    createEventLog({
      actionType: ActionType.CREATED,
      condition,
    } as ConditionEventLogRequest);
    return condition;
  }

  async migrate(conditions: ConditionForCsv[]) {
    for (const iterator of conditions) {
      const condition = {
        categoryId: iterator.categoryId,
        labelColor: iterator.labelColor,
        textColor: iterator.textColor,
        name: iterator.name,
        nameAr: iterator.nameAr,
        scoreRange: {
          min: +iterator.scoreRangeMin,
          max: +iterator.scoreRangeMax,
        },
        status: Status.ACTIVE,
        banners: [
          {
            lang: BannerLang.AR,
            source: BannerSource.LISTING,
            url: iterator.bannerListingAr,
          },
          {
            lang: BannerLang.EN,
            source: BannerSource.LISTING,
            url: iterator.bannerListingEn,
          },
          {
            lang: BannerLang.AR,
            source: BannerSource.SPP,
            url: iterator.bannerListingAr,
          },
          {
            lang: BannerLang.EN,
            source: BannerSource.SPP,
            url: iterator.bannerListingEn,
          },
        ],
        isPreset: false,
      } as Condition;
      this.validateNeedParams(condition);
      const conditionRow = this.repo.create(condition);
      await this.repo.getEntityManager().persistAndFlush(conditionRow);

      // cache needed data cuz we will have a lot of read request
      const key = `condition_${conditionRow.id}`;
      setCache(key, condition, 60 * 60);
    }
  }

  async update(conditionDto: ConditionDto): Promise<ConditionDto> {
    this.validateNeedParams(conditionDto);

    let condition = await this.repo.findOne({
      id: conditionDto.id,
    });
    if (!condition) {
      throw new BadRequestException('In correct condition info');
    }
    condition = Object.assign(condition, conditionDto);
    condition = await this.repo.upsert(condition);
    await this.repo.getEntityManager().persistAndFlush(condition);

    // cache needed data cuz we will have a lot of read request
    const key = `condition_${condition.id}`;
    setCache(key, condition, 60 * 60);
    // this.categoryConditionService.cacheCategoryCondition(condition.id);

    // send kafka event
    createEventLog({
      actionType: ActionType.UPDATED,
      condition: conditionDto,
    } as ConditionEventLogRequest);
    return condition as ConditionDto;
  }

  async delete(id: string): Promise<ConditionDto> {
    let condition = await this.repo.findOne({
      id: id,
    });
    if (!condition) {
      throw new BadRequestException('In correct condition info');
    }
    condition.status = Status.DELETED;
    condition = await this.repo.upsert(condition);
    await this.repo.getEntityManager().persistAndFlush(condition);
    await this.categoryConditionService.removeBulk(id);
    createEventLog({
      actionType: ActionType.DELETED,
      condition: {
        id: condition.id,
        categoryId: condition.categoryId,
        // fake score range to target 0 order to add this deleted condition to it
        scoreRange: {
          min: 0,
          max: 0,
        },
      },
    } as ConditionEventLogRequest);
    return condition;
  }

  async uploadImage(file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.')[1]; // get file extension from original file name
    return this.amazonService.uploadImage(
      `conditions/${uuidv4()}.${fileExtension}`,
      file.buffer,
    );
  }

  validateNeedParams(conditionDto: ConditionDto) {
    if (
      conditionDto.scoreRange &&
      conditionDto.scoreRange.max < conditionDto.scoreRange.min
    ) {
      throw new BadRequestException('Invalid scoreRange value');
    }
  }
}
