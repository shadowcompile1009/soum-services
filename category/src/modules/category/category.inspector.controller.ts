import {
  Get,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger'; // Importing Swagger decorators
import { CategoryService } from './category.service';
import { Mapper } from './Mapper';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { StanderResponse } from '@src/dto/stander.response';
import { createStandardResponse } from '@src/utils/standerResponse';
import { CategoryTypes } from './enums/category-types.enums';

@Controller('/inspector-category')
@ApiTags('inspector Categories') // This tags all the endpoints in Swagger UI
export class InspectorCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/lookup')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Get subcategories for lookup' })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: String,
    description: 'Parent category ID',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Category type',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of items to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset for pagination',
  })
  @ApiHeader({
    name: 'token',
    description: 'JWT Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved subcategories',
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

      const mappedResult = Mapper.CategoryToAdmCateoryLookupMapper(
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
