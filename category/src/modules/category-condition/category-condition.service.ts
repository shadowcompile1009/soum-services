import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryConditionRepository } from './category-condition.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CategoryConditionDto,
  CategoryConditionForCSV,
  PriceQualityDto,
} from './dto/category-condition.dto';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { Condition } from '../condition/entities/condition';
import { V2Service } from '../v2/v2.service';
import { GetVariantsRequest } from '../grpc/proto/v2.pb';
import { Status } from '../condition/enums/status.enum';
import { UpdateCategoryConditionDto } from './dto/update-category-condition.dto';

import {
  CategoryCondition,
  PriceQuality,
  PriceQualityNames,
} from './entities/category-condition';
import {
  GetCatConPriceRangeRequest,
  GetCatConPriceRangeResponse,
  GetProductCatConRequest,
} from '../grpc/proto/category.pb';
import { sortBy } from 'lodash';
import { FilterQuery } from '@mikro-orm/core';
import { getCache, setCache } from '@src/utils/redis';
import { CategoryConditionJobData } from '@src/utils/bullMQ.service';

@Injectable()
export class CategoryConditionService {
  constructor(
    @InjectRepository(CategoryCondition)
    private repo: CategoryConditionRepository,
    readonly v2Service: V2Service,
  ) {}

  getZeroPriceQuality(): PriceQuality[] {
    return Object.keys(PriceQualityNames).map((PriceQualityName, index) => {
      return Object.assign(new PriceQuality(), {
        price: 0,
        TTS: 0,
        position: index,
        name: PriceQualityNames[PriceQualityName],
      });
    });
  }

  async AddNewCategoryConditions(condition: Condition) {
    const { variants } = await this.v2Service.getVariants({
      categoryId: condition.categoryId,
    } as GetVariantsRequest);
    const categoryConditions = variants.map((elem) => {
      return Object.assign(new CategoryCondition(), {
        condition: condition,
        categoryId: elem.id, // here it represent variant
        priceQualityList: [],
        priceNudge: {
          min: 0,
          max: 0,
        },
      });
    });
    return this.repo
      .getEntityManager()
      .insertMany<CategoryCondition>(CategoryCondition, categoryConditions);
  }

  async migrateCategoryConditionsUpsert(
    condition: Condition,
    categoryConditionForCSV: CategoryConditionForCSV,
  ): Promise<CategoryConditionDto> {
    try {
      let categoryCondition = this.repo.create({
        condition: {
          id: condition.id,
        },
        categoryId: categoryConditionForCSV?.variantId,
        priceQualityList: [
          {
            name: PriceQualityNames.EXCELLENT,
            price: Number(
              categoryConditionForCSV.priceExcellent
                ?.toString()
                ?.replace(/\,/g, ''),
            ),
            TTS: Number(
              categoryConditionForCSV.TTSExcellent?.toString()?.replace(
                /\,/g,
                '',
              ),
            ),
            position: 0,
          },
          {
            name: PriceQualityNames.FAIR,
            price: Number(
              categoryConditionForCSV.priceFair?.toString()?.replace(/\,/g, ''),
            ),
            TTS: Number(
              categoryConditionForCSV.TTSFair?.toString()?.replace(/\,/g, ''),
            ),
            position: 1,
          },
          {
            name: PriceQualityNames.FAIR_EXPENSIVE,
            price: Number(
              categoryConditionForCSV.priceFairExpensive
                ?.toString()
                ?.replace(/\,/g, ''),
            ),
            TTS: Number(
              categoryConditionForCSV.TTSFairExpensive?.toString()?.replace(
                /\,/g,
                '',
              ),
            ),
            position: 2,
          },
          {
            name: PriceQualityNames.ABOVE,
            price: Number(
              categoryConditionForCSV.priceAbove
                ?.toString()
                ?.replace(/\,/g, ''),
            ),
            TTS: Number(
              categoryConditionForCSV.TTSAbove?.toString()?.replace(/\,/g, ''),
            ),
            position: 3,
          },
          {
            name: PriceQualityNames.EXPENSIVE,
            price: Number(
              categoryConditionForCSV.priceExpensive
                ?.toString()
                ?.replace(/\,/g, ''),
            ),
            TTS: Number(
              categoryConditionForCSV.TTSExpensive?.toString()?.replace(
                /\,/g,
                '',
              ),
            ),
            position: 4,
          },
          {
            name: PriceQualityNames.EXPENSIVE_UPPER,
            price: Number(
              categoryConditionForCSV.priceExpensiveUpper
                ?.toString()
                ?.replace(/\,/g, ''),
            ),
            TTS: Number(
              categoryConditionForCSV.TTSExpensiveUpper?.toString()?.replace(
                /\,/g,
                '',
              ),
            ),
            position: 5,
          },
        ],
        priceNudge: {
          min: Number(
            categoryConditionForCSV.priceNudgeMin
              ?.toString()
              ?.replace(/\,/g, ''),
          ),
          max: Number(
            categoryConditionForCSV.priceNudgeMax
              ?.toString()
              ?.replace(/\,/g, ''),
          ),
        },
        position: condition.positionEn,
      });

      await this.repo.nativeDelete({
        categoryId: categoryConditionForCSV.variantId,
        condition: {
          id: condition.id,
        },
      });

      for (const iterator of categoryCondition.priceQualityList) {
        const priceQualityDto = (categoryCondition.priceQualityList || []).find(
          (elem) => elem.name === iterator.name,
        );
        if (priceQualityDto) {
          iterator.TTS = priceQualityDto.TTS;
          iterator.price = priceQualityDto.price;
        }
      }
      await this.repo.getEntityManager().upsert(categoryCondition);

      return categoryCondition as CategoryConditionDto;
    } catch (error) {
      console.log(error.message, categoryConditionForCSV.categoryId, categoryConditionForCSV.conditionName);
      return null;
    }
  }

  async update(
    categoryConditionDto: UpdateCategoryConditionDto,
  ): Promise<CategoryConditionDto> {
    let categoryCondition = await this.repo.findOne(categoryConditionDto.id);
    if (!categoryCondition) {
      throw new BadRequestException('In correct condition info');
    }
    categoryCondition = this.repo.assign(
      categoryCondition,
      categoryConditionDto,
    );

    if (!categoryCondition.priceQualityList?.length) {
      categoryCondition.priceQualityList = this.getZeroPriceQuality();
    }

    for (const iterator of categoryCondition.priceQualityList) {
      const priceQualityDto = (
        categoryConditionDto.priceQualityList || []
      ).find((elem) => elem.name === iterator.name);
      if (priceQualityDto) {
        iterator.TTS = priceQualityDto.TTS;
        iterator.price = priceQualityDto.price;
      }
    }

    await this.repo.getEntityManager().upsert(categoryCondition);
    await this.repo.getEntityManager().persistAndFlush(categoryCondition);

    return categoryCondition as CategoryConditionDto;
  }

  async removeBulk(conditionId: string) {
    await this.repo.nativeUpdate(
      { condition: { id: conditionId } },
      { status: Status.DELETED },
    );
  }

  async getListWithCondition(
    filter: { categoryId: string },
    offset: number,
    limit: number,
  ) {
    const { items, total } = await this.deepLoad(
      {
        categoryId: filter.categoryId,
        status: Status.ACTIVE,
      },
      limit,
      offset,
    );
    items.forEach((element) => {
      if (!element.priceQualityList?.length) {
        element.priceQualityList =
          this.getZeroPriceQuality() as PriceQualityDto[];
      }
    });
    return {
      items: items || [],
      offset,
      limit,
      total,
    } as PaginatedDto<CategoryConditionDto>;
  }

  // plz give more focus
  async getCategoryConditionPriceRange(
    payload: GetCatConPriceRangeRequest,
  ): Promise<GetCatConPriceRangeResponse> {
    const categoryCondition = await this.repo.findOne({
      categoryId: payload.variantId,
      condition: { id: payload.conditionId },
    });
    let priceRange = { max: 0, min: 0 };
    const priceQualityList = sortBy(categoryCondition?.priceQualityList, [
      'position',
    ]);

    if (priceQualityList?.length) {
      const excellent = priceQualityList.find(
        (elem) => elem.name === PriceQualityNames.EXCELLENT,
      );
      const fair = priceQualityList.find(
        (elem) => elem.name === PriceQualityNames.FAIR,
      );
      const expensive = priceQualityList.find(
        (elem) => elem.name === PriceQualityNames.EXPENSIVE,
      );
      switch (payload.catConditionQuality) {
        case PriceQualityNames.EXPENSIVE:
          // Expensive: fair(price) > expensive(price);
          priceRange = { min: fair.price, max: expensive.price };
          break;
        case PriceQualityNames.EXCELLENT:
          // excellent: 0 > excellent(price);
          priceRange = { min: 0, max: excellent.price };
          break;
        case PriceQualityNames.FAIR:
          // Fair: excellent(price) > fair(price);
          priceRange = { min: excellent.price, max: fair.price };
          break;
      }
    }
    return {
      priceRange,
    };
  }

  // plz give more focus
  async GetProductCondition(payload: GetProductCatConRequest) {
    if (!payload.id) return null;
    let categoryCondition = (await getCache(
      `category_condition_${payload.id}_${payload.variantId}`,
    )) as CategoryCondition;

    if (!categoryCondition) {
      categoryCondition = await this.repo.findOne({
        condition: { id: payload.id },
        categoryId: payload.variantId,
      });
      if (!categoryCondition) return null;
      setCache(
        `category_condition_${categoryCondition.condition.id}_${categoryCondition.categoryId}`,
        categoryCondition,
        60 * 60,
      );
    }

    if (!categoryCondition?.priceQualityList?.length) return null;
    const priceQualityList = sortBy(categoryCondition?.priceQualityList, [
      'position',
    ]);
    let productPriceQuality = priceQualityList[priceQualityList.length - 1];
    for (let index = 0; index < priceQualityList.length - 1; index++) {
      const startRange = priceQualityList[index];
      const endRange = priceQualityList[index + 1];
      if (
        startRange.price <= payload.sellPrice &&
        endRange.price >= payload.sellPrice
      ) {
        productPriceQuality = startRange;
        break;
      }
    }
    return productPriceQuality;
  }

  async deepLoad(
    where: FilterQuery<CategoryCondition>,
    limit: number,
    offset: number,
  ) {
    const result = await this.repo.findAndCount(where, {
      limit: limit,
      offset: offset,
      populate: ['condition'],
      orderBy: {
        createdAt: 1,
      },
    });
    return {
      items: result[0],
      total: result[1],
    };
  }

  async cacheCategoryCondition(conditionId: string) {
    const categoryConditionList = await this.repo.find({
      condition: { id: conditionId },
    });
    return Promise.all(
      (categoryConditionList as CategoryCondition[]).map((element) => {
        return Promise.resolve(
          setCache(
            `category_condition_${element.condition.id}_${element.categoryId}`,
            element,
            60 * 60,
          ),
        );
      }),
    );
  }
}
