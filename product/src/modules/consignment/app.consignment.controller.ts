import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { CustomResponse } from '@src/customResponse';
import { HttpStatusCode } from 'axios';
import { ConsignmentService } from './consignment.service';
import {
  APPListMyConsignmentsResponseDTO,
  CheckEligibilityRequestDTO,
  CheckEligibilityResponseDTO,
  ConsignmentResponseDto,
  ConsignmentMinimumPriceDTO,
  CreateConsignmentDTO,
  UserConsignmentApprovalDto,
} from './dto/consignment.dto';

@ApiTags('consignment')
@Controller('app/consignment')
export class AppConsignmentController {
  constructor(private readonly consignmentService: ConsignmentService) {}

  @Post('/check-eligibility')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: CheckEligibilityResponseDTO })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  @HttpCode(HttpStatusCode.Ok)
  async checkEligibility(@Body() body: CheckEligibilityRequestDTO) {
    return this.consignmentService.checkEligibility(body);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: CustomResponse<any> })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async create(
    @Body() payload: CreateConsignmentDTO,
    @Req() request: { user: { userId: string } },
  ) {
    return this.consignmentService.create({
      ...payload,
      ...{ userId: request.user.userId },
    });
  }

  @Get('/my-consignments')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: APPListMyConsignmentsResponseDTO,
    isArray: true,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async list(@Req() request: { user: { userId: string } }) {
    return this.consignmentService.listMyConsignments(request.user.userId);
  }

  @Post('/consignment-minimum-price')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: Number })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async consignmentMinimumPriceDto(
    @Body() payload: ConsignmentMinimumPriceDTO,
  ) {
    return this.consignmentService.calculateMinimumPriceForConsignment(
      payload.amount,
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Condition updated successfully',
    type: ConsignmentResponseDto,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async updateConsignmentStatus(
    @Param('id') id: string,
    @Body() updateDto: UserConsignmentApprovalDto,
    @Req() request: { user: { userId: string } },
  ) {
    return this.consignmentService.userUpdateConsignmentStatus(
      id,
      request.user.userId,
      updateDto.isApproved,
    );
  }
}
