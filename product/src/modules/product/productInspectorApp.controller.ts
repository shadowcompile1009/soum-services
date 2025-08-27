import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiParam,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { CustomResponse, CustomResponseStatus } from '@src/customResponse';
import { ViewProductService } from './viewProduct.service';
import { DeepLoadReq } from './dto/deepLoadReq.dto';

@ApiTags('Product Inspector')
@Controller('inspector-app')
@UseGuards(LegacyAdminOnlyJwtAuthGuard)
export class ProductInspectorAppController {
  constructor(private readonly viewService: ViewProductService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed product data by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'isGetImages',
    description: 'Whether to include product images',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'isGetStockImages',
    description: 'Whether to include stock images',
    type: Boolean,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product data',
    type: CustomResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async getProductData(@Param() param: any, @Query() query: any) {
    try {
      const prodId = param.id;
      const deepLoadReq: DeepLoadReq = {
        isGetImages: query.isGetImages || true,
      };
      const result = await this.viewService.getByIdForInspector(prodId);
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      } as CustomResponse<any>;
    } catch (error) {
      return {
        status: CustomResponseStatus.FAIL,
        data: null,
        message: error.message,
      } as CustomResponse<any>;
    }
  }
}
