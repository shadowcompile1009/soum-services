import {
  Get,
  Param,
  Logger,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger'; // Importing Swagger decorators
import { CategoryService } from './category.service';
import {
  AdminCategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateCategoryPositionDto,
} from './dto/category.dto';
import { Mapper } from './Mapper';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { StanderResponse } from '@src/dto/stander.response';
import { createStandardResponse } from '@src/utils/standerResponse';
import { CategoryTypes } from './enums/category-types.enums';

@Controller('/adm-category')
@ApiTags('Admin Categories') // This tags all the endpoints in Swagger UI
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiHeader({
    name: 'token', // Custom header name
    description: 'JWT Authentication token', // Description of the token header
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully created',
    type: StanderResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: StanderResponse,
  })
  async createCategory(
    @Body() categoryDto: CreateCategoryDto,
  ): Promise<StanderResponse<any>> {
    try {
      const result = await this.categoryService.createCategory(categoryDto);
      return createStandardResponse(
        Mapper.CategoryToAdminCateoryMapper(result),
      );
    } catch (error) {
      Logger.error('Error in createCategory controller', error);
      return createStandardResponse(null, 'Error creating category', 500, [
        error,
      ]);
    }
  }

  @Put('/order')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Update the order of categories' })
  @ApiHeader({
    name: 'token',
    description: 'JWT Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories order successfully updated',
    type: StanderResponse,
  })
  async updateCategoriesOrder(
    @Body() categories: UpdateCategoryPositionDto[],
  ): Promise<StanderResponse<any>> {
    try {
      const updatedCategories =
        await this.categoryService.updateCategoriesOrder(categories);
      return createStandardResponse(updatedCategories);
    } catch (error) {
      Logger.error('Error in updateCategoriesOrder controller', error);
      return createStandardResponse(
        null,
        'Error updating categories order',
        500,
        [error],
      );
    }
  }

  @Put(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Update a specific category' })
  @ApiParam({ name: 'id', description: 'Category ID to update' })
  @ApiHeader({
    name: 'token',
    description: 'JWT Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully updated',
    type: StanderResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error updating category',
    type: StanderResponse,
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<StanderResponse<any>> {
    try {
      const result = await this.categoryService.updateCategory(id, categoryDto);
      return createStandardResponse(
        Mapper.CategoryToAdminCateoryMapper(result),
      );
    } catch (error) {
      Logger.error('Error in updateCategory controller', error);
      return createStandardResponse(null, 'Error updating category', 500, [
        error,
      ]);
    }
  }

  @Delete(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID to delete' })
  @ApiHeader({
    name: 'token',
    description: 'JWT Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully deleted',
    type: StanderResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error deleting category',
    type: StanderResponse,
  })
  async deleteCategory(@Param('id') id: string): Promise<StanderResponse<any>> {
    try {
      await this.categoryService.deleteCategory(id); // Soft delete (status change)
      return createStandardResponse(null, 'Category deleted successfully', 200);
    } catch (error) {
      Logger.error('Error in deleteCategory controller', error);
      return createStandardResponse(null, 'Error deleting category', 500, [
        error,
      ]);
    }
  }

  @Get('/lookup')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Get subcategories for lookup' })
  @ApiQuery({ name: 'parentId', required: false, type: String, description: 'Parent category ID' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Category type' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit of items to return' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
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

  @Get('/:id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiHeader({
    name: 'token',
    description: 'JWT Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: StanderResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Category not found',
    type: StanderResponse,
  })
  async getCategory(@Param('id') id: string): Promise<StanderResponse<any>> {
    try {
      const result = await this.categoryService.getCategory(id);
      if (!result) {
        return createStandardResponse(null, 'Category not found', 400);
      }
      return createStandardResponse(
        Mapper.CategoryToAdminCateoryMapper(result),
      );
    } catch (error) {
      Logger.error('Error in getCategory controller', error);
      return createStandardResponse(null, 'Error retrieving category', 500, [
        error,
      ]);
    }
  }

  @Get('/')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOperation({ summary: 'Get categories by IDs' })
  @ApiQuery({ name: 'ids', required: true, type: [String], description: 'List of category IDs' })
  @ApiHeader({
    name: 'token',
    description: 'JWT Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: StanderResponse,
  })
  async getCategoriesByIds(
    @Query('ids') ids: string[],
  ): Promise<StanderResponse<any>> {
    try {
      const result = await this.categoryService.getCategoriesByIds(ids);
      if (!result) {
        return createStandardResponse(null, 'Categories not found', 400);
      }
      return createStandardResponse(
        Mapper.CategoryArrayToAdminCateoryMapper(result || []),
      );
    } catch (error) {
      Logger.error('Error in getCategoriesByIds controller', error);
      return createStandardResponse(null, 'Error retrieving categories', 500, [
        error,
      ]);
    }
  }
}
