import { Body, Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { createKey, getCache, setCache } from '@src/utils/redis';
import { CategoryTypes } from './enums/category-types.enums';
import { CategoryFilter } from './types/category.types';

@Controller('/')
@ApiTags('Categories')
export class CategoryController {
  @Inject(CategoryService)
  private readonly categoryService: CategoryService;

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Get('/categories')
  async getCategories(@Body() filter: CategoryFilter) {
    const offset = filter.offset || 0;
    const limit = filter.limit || 100;

    const key = createKey('categories', [`${offset}`, `${limit}`]);
    let categoriesData = await getCache<any>(key);
    if (categoriesData == null || categoriesData == undefined) {
      categoriesData = await this.categoryService.getCategories(
        null,
        CategoryTypes.CATEGORY,
        [],
        offset,
        limit,
      );
      await setCache(key, categoriesData, 300);
    }

    return categoriesData;
  }
}
