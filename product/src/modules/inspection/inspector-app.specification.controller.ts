import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CustomResponse, CustomResponseStatus } from '@src/customResponse';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { SpecificationService } from './specification.service';
import { SpecificationBodyDto } from './dto/specification-body.dto';

@Controller('inspector-app/specification')
@ApiTags('Inspector App - Specification Management')
@UseGuards(LegacyAdminOnlyJwtAuthGuard)
export class InspectorAppSpecificationController {
  constructor(
    private readonly specificationService: SpecificationService,
  ) {}

  @Post('/:categoryId')
  @ApiOperation({ 
    summary: 'Create specification for a category',
    description: 'Creates a new specification report and inspection report for a given category.'
  })
  @ApiParam({
    name: 'categoryId',
    description: 'The ID of the category to create specification for',
    type: String,
    required: true
  })
  @ApiBody({
    type: SpecificationBodyDto,
    description: 'Specification and inspection reports containing inspection criteria and requirements'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully created specification',
    type: CustomResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin authentication required'
  })
  async createSpecification(
    @Param('categoryId') categoryId: string,
    @Body() payload: SpecificationBodyDto,
  ) {
    try {
      const result = await this.specificationService.createSpecification(
        categoryId,
        payload.specificationReport,
        payload.inspectionReport,
      );
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

  @Patch('/:categoryId')
  @ApiOperation({ 
    summary: 'Update specification for a category',
    description: 'Updates an existing specification report and inspection report for a given category.'
  })
  @ApiParam({
    name: 'categoryId',
    description: 'The ID of the category to update specification for',
    type: String,
    required: true
  })
  @ApiBody({
    type: SpecificationBodyDto,
    description: 'Updated specification and inspection reports'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated specification',
    type: CustomResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or specification not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin authentication required'
  })
  async updateSpecification(
    @Param('categoryId') categoryId: string,
    @Body() payload: SpecificationBodyDto,
  ) {
    try {
      const result = await this.specificationService.updateSpecification(
        categoryId,
        payload.specificationReport,
        payload.inspectionReport,
      );
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

  @Get('/:categoryId')
  @ApiOperation({ 
    summary: 'Get specification for a category',
    description: 'Retrieves the specification report and inspection report for a given category. Returns null if no specification exists.'
  })
  @ApiParam({
    name: 'categoryId',
    description: 'The ID of the category to get specification for',
    type: String,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved specification',
    type: CustomResponse
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin authentication required'
  })
  async getSpecification(
    @Param('categoryId') categoryId: string,
  ) {
    try {
      const result = await this.specificationService.getSpecification(categoryId);
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

  @Delete('/:categoryId')
  @ApiOperation({ 
    summary: 'Delete specification for a category',
    description: 'Permanently deletes the specification report and inspection report for a given category.'
  })
  @ApiParam({
    name: 'categoryId',
    description: 'The ID of the category to delete specification for',
    type: String,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted specification',
    type: CustomResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Specification not found'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin authentication required'
  })
  async deleteSpecification(
    @Param('categoryId') categoryId: string,
  ) {
    try {
      await this.specificationService.deleteSpecification(categoryId);
      return {
        status: CustomResponseStatus.SUCCESS,
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