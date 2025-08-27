import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category';
import { CategoryStatus } from './enums/category-status.enum';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  webNavigationReqDto,
} from './dto/category.dto';
import {
  setCache,
  getCache,
  deleteCache,
  deleteWithPattern,
} from '@src/utils/redis';
import { CategoryTypes } from './enums/category-types.enums';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { CategoryProducerService } from '@src/kafka/product.producer';
import { CategoryActionsEnum } from './enums/category-Actions.enum';
import { CategoryKafkaDto } from './dto/category.kafka.dto';
import { createStandardResponse } from '@src/utils/standerResponse';
import { CategoryAttribute } from './entities/categoryAttribute';
import { Option } from '../option/entities/option';
import { Attribute } from '../attribute/entities/attribute';
import { GetCategoriesRequest } from '../grpc/proto/category.pb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: EntityRepository<Category>,
    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepo: EntityRepository<CategoryAttribute>,
    private readonly categoryProducerService: CategoryProducerService,
    private readonly em: EntityManager,
  ) {}

  async getCategoryByName(name: string): Promise<Category> {
    const result = await this.repo.findOne({
      $or: [{ name }, { nameAr: name }],
    });
    return result;
  }

  async getCategoryByNames(categories: webNavigationReqDto[]) {
    const L1 = categories.length
      ? categories.find((elem) => elem.type == CategoryTypes.CATEGORY)?.name
      : null;
    const L2 =
      categories.length > 1
        ? categories.find((elem) => elem.type == CategoryTypes.BRAND)?.name
        : null;
    const L3 =
      categories.length > 2
        ? categories.find((elem) => elem.type == CategoryTypes.MODEL)?.name
        : null;

    let category = null,
      brand = null,
      model = null;
    if (L1) {
      category = await this.repo.findOne({
        status: CategoryStatus.ACTIVE,
        type: CategoryTypes.CATEGORY,
        $or: [{ name: { $ilike: L1 } }, { nameAr: { $ilike: L1 } }],
      });
    }
    if (L2 && category) {
      brand = await this.repo.findOne({
        status: CategoryStatus.ACTIVE,
        type: CategoryTypes.BRAND,
        parentId: category.id,
        $or: [{ name: { $ilike: L2 } }, { nameAr: { $ilike: L2 } }],
      });
    }

    if (L3 && brand) {
      model = await this.repo.findOne({
        status: CategoryStatus.ACTIVE,
        type: CategoryTypes.MODEL,
        parentId: brand.id,
        $or: [{ name: { $ilike: L3 } }, { nameAr: { $ilike: L3 } }],
      });
    }
    return {
      category,
      brand,
      model,
    };
  }

  async createCategory(categoryDto: CreateCategoryDto) {
    const errors = await this.validate(categoryDto);
    if (errors.length) {
      createStandardResponse(null, 'Can not create category', 400, errors);
    }

    const category = this.repo.create({
      name: categoryDto.name,
      nameAr: categoryDto.nameAr,
      position: categoryDto.position,
      status: categoryDto.status,
      currentPrice: categoryDto.currentPrice,
      maxPercentage: categoryDto.maxPercentage,
      parentId: categoryDto.parentId,
      type: categoryDto.type,
      images: (categoryDto?.images || []).map((elem) => ({
        source: elem.source,
        url: elem.url,
        type: elem.type,
      })),
    });
    await this.em.persistAndFlush(category);

    const categoryAttributes = (categoryDto?.categoryAttributes || []).map(
      (elem) => {
        const categoryAttribute = {
          category: { id: category.id },
          attribute: { id: elem.attributeId },
          option: { id: elem.featureId },
        } as CategoryAttribute;
        return this.categoryAttributeRepo.create(categoryAttribute);
      },
    );
    await this.categoryAttributeRepo.upsertMany(categoryAttributes);

    await setCache(`category_${category.id}`, category, 60);
    await this.postCreateCategoryEvents(category, CategoryActionsEnum.CREATED);

    return category;
  }

  async createCategoryMigration(categoryDto: CreateCategoryDto) {
    const category = this.repo.create({
      id: categoryDto.id,
      name: categoryDto.name,
      nameAr: categoryDto.nameAr,
      position: categoryDto.position,
      status: categoryDto.status,
      currentPrice: categoryDto.currentPrice,
      maxPercentage: categoryDto.maxPercentage,
      parentId: categoryDto.parentId,
      type: categoryDto.type,
      images: (categoryDto?.images || []).map((elem) => ({
        source: elem.source,
        url: elem.url,
        type: elem.type,
      })),
    });

    await this.em.persistAndFlush(category);
    return category;
  }

  async getCategory(id: string): Promise<Category | null> {
    const cachedCategory = await getCache<Category>(`category_${id}`);
    if (cachedCategory) return cachedCategory as Category;

    const category: Category = await this.repo.findOne(id, {
      populate: ['categoryAttributes'],
    });
    if (category) {
      await setCache(`category_${id}`, category, 60);
    }

    return category;
  }

  async updateCategory(id: string, categoryDto: UpdateCategoryDto) {
    categoryDto.id = id;
    const errors = await this.validate(categoryDto);
    if (errors.length) {
      createStandardResponse(null, 'Can not create category', 400, errors);
    }

    const category = await this.repo.findOne(id, {
      populate: ['categoryAttributes'],
    });
    if (!category) throw new Error('Category not found');

    this.repo.assign(category, {
      id: id,
      name: categoryDto.name || category.name,
      nameAr: categoryDto.nameAr || category.nameAr,
      position: categoryDto.position || category.position,
      status: categoryDto.status || category.status,
      currentPrice: categoryDto.currentPrice || category.currentPrice,
      maxPercentage: categoryDto.maxPercentage || category.maxPercentage,
      parentId: categoryDto.parentId || category.parentId,
      type: categoryDto.type || category.type,
      images: (categoryDto?.images || []).map((elem) => ({
        source: elem.source,
        url: elem.url,
        type: elem.type,
      })),
    });
    await this.em.persistAndFlush(category);

    await this.em.nativeDelete(
      CategoryAttribute,
      category.categoryAttributes.toArray(),
    );

    const categoryAttributes = (categoryDto?.categoryAttributes || []).map(
      (elem) => {
        const categoryAttribute = {
          category: { id: category.id },
          attribute: { id: elem.attributeId },
          option: { id: elem.featureId },
        } as CategoryAttribute;
        return this.categoryAttributeRepo.create(categoryAttribute);
      },
    );
    await this.categoryAttributeRepo.upsertMany(categoryAttributes);

    deleteCache([`category_${id}`]);
    deleteWithPattern(`categories_*`);
    await this.postCreateCategoryEvents(category, CategoryActionsEnum.UPDATED);

    return category;
  }

  async deleteCategory(id: string): Promise<Category | null> {
    const category = await this.repo.findOne(id);
    if (!category) throw new Error('Category not found');

    category.status = CategoryStatus.DELETED;
    await this.em.persistAndFlush(category);

    deleteCache([`category_${id}`]);
    deleteWithPattern(`categories_*`);
    await this.postCreateCategoryEvents(category, CategoryActionsEnum.DELETED);

    return category;
  }

  async getCategoriesByIds(ids: string[]): Promise<Category[]> {
    const categories = [];
    const missingIds: string[] = [];

    for (const id of ids) {
      const cachedCategory = await getCache<Category>(`category_${id}`);
      if (cachedCategory) {
        categories.push(cachedCategory);
      } else {
        missingIds.push(id);
      }
    }

    if (missingIds.length > 0) {
      const dbCategories = await this.repo.find({ id: { $in: missingIds } });
      for (const category of dbCategories) {
        categories.push(category);
        await setCache(`category_${category.id}`, category, 60);
      }
    }

    return categories;
  }

  async getCategories(
    parentId?: string,
    type?: CategoryTypes,
    ids?: string[],
    limit?: number,
    offset?: number,
  ): Promise<PaginatedDto<Category>> {
    const cacheKey = `categories_parent_${parentId}_type_${type}_limit_${limit}_offset_${offset}`;
    const cachedCategories = await getCache<PaginatedDto<Category>>(cacheKey);

    let searchObject: any = {};
    let pagainatioObject: any = {};

    if (parentId) searchObject.parentId = parentId;
    if (type) searchObject.type = type;
    if (ids?.length) searchObject.id = { $in: ids };
    if (limit) pagainatioObject.limit = limit;
    if (offset) pagainatioObject.offset = offset;


    if (cachedCategories) return cachedCategories as PaginatedDto<Category>;

    const [dbCategories, total] = await this.repo.findAndCount(
      { ...searchObject, status: CategoryStatus.ACTIVE },
      { ...pagainatioObject, orderBy: { position: 'asc' } },
    );

    const paginatedResult: PaginatedDto<Category> = {
      total,
      limit,
      offset,
      items: dbCategories,
    };
    await setCache(cacheKey, paginatedResult, 60);
    return paginatedResult;
  }

  async updateCategoriesOrder(
    categoriesToUpdate: { id: string; position: number }[],
  ): Promise<Category[]> {
    const updatedCategories: Category[] = [];

    for (const { id, position } of categoriesToUpdate) {
      const categoryToUpdate = await this.repo.findOne(id);
      categoryToUpdate.position = position;
      await this.postCreateCategoryEvents(
        categoryToUpdate,
        CategoryActionsEnum.DELETED,
      );
      updatedCategories.push(categoryToUpdate);
    }

    await this.em.persistAndFlush(updatedCategories);

    return updatedCategories;
  }

  async postCreateCategoryEvents(
    category: Category,
    action: CategoryActionsEnum,
  ) {
    await this.categoryProducerService.produce({
      action,
      data: {
        id: category.id,
        name: category.name,
        nameAr: category.nameAr,
        position: category.position,
        type: category.type,
        status: category.status,
        parentId: category.parentId,
        images: category.images,
        maxPercentage: category.maxPercentage,
        currentPrice: category.currentPrice,
      } as CategoryKafkaDto,
    });
  }

  async validate(dto: CreateCategoryDto | UpdateCategoryDto) {
    let errors = [];
    if (dto.type !== CategoryTypes.SUPER_CATEGORY && !dto.parentId) {
      errors.push({
        field: 'parentId',
        message: 'only SUPER_CATEGORY can not have parentId',
      });
    }
    if (
      [CategoryTypes.CATEGORY, CategoryTypes.SUPER_CATEGORY].includes(
        dto.type,
      ) &&
      !dto.maxPercentage
    ) {
      errors.push({
        field: 'maxPercentage',
        message: 'maxPercentage is required for SUPER_CATEGORY and CATEGORY',
      });
    }
    if (!dto.currentPrice && dto.type === CategoryTypes.VARIANT) {
      errors.push({
        field: 'currentPrice',
        message: 'currentPrice is required for VARIANT',
      });
    }

    const category = await this.repo.findOne({
      id: { $ne: dto.id },
      name: dto.name,
      nameAr: dto.nameAr,
      type: dto.type,
      parentId: dto.parentId,
    });

    if (category) {
      errors.push({
        field: 'General',
        message: 'Found category with same info , plz change',
      });
    }
    console.log(errors);
    return errors;
  }
}
