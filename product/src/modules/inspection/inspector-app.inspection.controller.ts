import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomResponse, CustomResponseStatus } from '@src/customResponse';
import { CreateInspectionDTO } from './dto/inspection.dto';
import { InspectionService } from './inspection.service';
import { ProductInspectionSettings } from '../product/entity/product-inspection-settings.entity';
import { ProductInspectionReport } from './dto/product-inspection-report.dto';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { ProductInspectionListItemDto } from './dto/product-inspection-list.dto';
import { ProductInspectionListQueryDto } from './dto/product-inspection-list-query.dto';
import {
  InspectionStatus,
  InspectionType,
} from './enum/inspection.status.enum';
import { PaginatedDto } from '@src/dto/paginated.dto';

@Controller('inspector-app/inspection')
@ApiTags('inspector-app-inspection') // Groups this endpoint under "Inspection" in Swagger UI
@UseGuards(LegacyAdminOnlyJwtAuthGuard)
export class InspectorAppInspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Patch('/report/:id')
  @ApiOperation({ summary: 'Create or update product inspection report' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created or updated product inspection report',
    type: ProductInspectionSettings,
  })
  async createOrUpdateInspectionReport(
    @Param('id') productId: string,
    @Body() payload: ProductInspectionReport,
    @Req() request: { user: { userId: string } },
  ) {
    try {
      payload.productId = productId;
      const result =
        await this.inspectionService.createOrupdateInspectionReport(
          payload,
          request?.user?.userId,
        );
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        status: CustomResponseStatus.FAIL,
        code: 400, // Ensure this is set to 400
        data: null,
        message: error.message,
      } as CustomResponse<any>);
    }
  }

  @Get('/report')
  @ApiOperation({
    summary: 'Get product inspection report by product and category',
  })
  @ApiQuery({ name: 'productId', required: true, type: String })
  @ApiQuery({ name: 'categoryId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns existing or default inspection report',
    type: ProductInspectionSettings,
  })
  async getProductInspection(
    @Query('productId') productId: string,
    @Query('categoryId') categoryId: string,
  ) {
    try {
      const result = await this.inspectionService.getProductInspection(
        productId,
        categoryId,
      );
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        status: CustomResponseStatus.FAIL,
        code: 400, // Ensure this is set to 400
        data: null,
        message: error.message,
      } as CustomResponse<any>);
    }
  }

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'Inspection created successfully',
    type: CustomResponse, // Customize if CustomResponse is generic
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    type: CreateInspectionDTO,
    description: 'Payload to create a new inspection',
  })
  async create(
    @Body() payload: CreateInspectionDTO,
    @Req() request: { user: { userId: string } },
  ) {
    try {
      const result = await this.inspectionService.createProductAndInspection(
        payload,
        request?.user?.userId || null,
      );
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        status: CustomResponseStatus.FAIL,
        code: 400, // Ensure this is set to 400
        data: null,
        message: error.message,
      } as CustomResponse<any>);
    }
  }

  @Get('status-counts')
  @ApiQuery({ name: 'categoryId', required: true, type: String })
  @ApiOperation({ summary: 'Get inspection counts grouped by status' })
  @ApiResponse({
    status: 200,
    description: 'Status counts',
    schema: {
      type: 'object',
      additionalProperties: { type: 'number' },
    },
  })
  async getInspectionStatusCounts(
    @Query('categoryId') categoryId: string,
    @Req() request: { user: { userId: string } },
  ) {
    try {
      const result = await this.inspectionService.countByStatus(
        request?.user?.userId || null,
        categoryId,
      );
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      } as CustomResponse<any>;
    } catch (error) {
      throw new BadRequestException({
        status: CustomResponseStatus.FAIL,
        code: 400, // Ensure this is set to 400
        data: null,
        message: error.message,
      } as CustomResponse<any>);
    }
  }

  @Get('/list-products')
  @ApiOperation({ summary: 'Get list of products with inspection status' })
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: InspectionStatus })
  @ApiQuery({ name: 'inspectionType', required: false, enum: InspectionType })
  @ApiQuery({ name: 'superCategoryId', required: false, type: String })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    description: 'Filter by product ID',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description:
      'Returns paginated list of products with their inspection status',
    type: PaginatedDto<ProductInspectionListItemDto>,
  })
  async getProductInspectionList(
    @Query() query: ProductInspectionListQueryDto,
    @Req() request: { user: { userId: string } },
  ) {
    try {
      const result =
        await this.inspectionService.getProductInspectionList(query);
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        status: CustomResponseStatus.FAIL,
        code: 400,
        data: null,
        message: error.message,
      } as CustomResponse<any>);
    }
  }
}
