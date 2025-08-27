import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Mapper } from './Mapper';
import { StanderResponse } from '@src/dto/stander.response';
import { createStandardResponse } from '@src/utils/standerResponse';
import { CategoryTypes } from './enums/category-types.enums';

@Controller('/web-category')
@ApiTags('Categories')
export class CategoryWebController {
  @Inject(CategoryService)
  private readonly categoryService: CategoryService;

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Get('/lookup')
  async getSubCategoriesForLookup(
    @Query('parentId') parentId: string,
    @Query('type') type: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<StanderResponse<any>> {
    try {
      if (!parentId?.trim()) parentId = null;
      if (!type?.trim()) type = null;
      const result = await this.categoryService.getCategories(
        parentId,
        type as CategoryTypes,
        [],
        limit,
        offset,
      );
      if (!result)
        return createStandardResponse(null, 'No subcategories found', 400);

      const mappedResult = Mapper.CategoryToAppCateoryLookupMapper(
        result.items,
      );
      return createStandardResponse({
        total: result.total,
        limit,
        offset,
        items: mappedResult,
      });
    } catch (error) {
      return createStandardResponse(
        null,
        'Error retrieving subcategories',
        500,
        [error],
      );
    }
  }
}
