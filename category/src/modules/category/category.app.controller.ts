import { Controller, Get, Inject, Logger, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Mapper } from './Mapper';
import { StanderResponse } from '@src/dto/stander.response';
import { createStandardResponse } from '@src/utils/standerResponse';
import { CategoryTypes } from './enums/category-types.enums';

@Controller('/app-category')
@ApiTags('App Categories')  // This adds the tag for grouping in Swagger UI
export class CategoryAppController {
  @Inject(CategoryService)
  private readonly categoryService: CategoryService;

  @Get('/status')
  @ApiOperation({ summary: 'Get the status of the category service' })
  @ApiResponse({ status: 200, description: 'Service is running' })
  @ApiHeader({
    name: 'token',  // Define the custom header for token
    description: 'Authentication token (JWT)',  // Description for the header
  })
  async getStatus() {
    return { statu: 'OK' };
  }

  @Get('/lookup')
  @ApiOperation({ summary: 'Get subcategories for lookup' })
  @ApiQuery({ name: 'parentId', required: false, type: String, description: 'Parent category ID' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Category type' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit of items to return' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved subcategories',
    type: StanderResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'No subcategories found',
    type: StanderResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error retrieving subcategories',
    type: StanderResponse,
  })
  async getSubCategoriesForLookup(
    @Query('parentId') parentId: string,
    @Query('type') type: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
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

      if (!result) {
        return createStandardResponse(null, 'No subcategories found', 400);
      }

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
      Logger.error('Error in getCategory controller', error);
      return createStandardResponse(
        null,
        'Error retrieving subcategories',
        500,
      );
    }
  }
}
