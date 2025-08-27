import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { ConsignmentService } from './consignment.service';
import {
  ConsignmentPayoutDetailsResponseDto,
  ConsignmentPayoutResponseDto,
  ConsignmentResponseDto,
  ListConsignmentRequestDTO,
  ListConsignmentResponseDTO,
  UpdateConsignmentConditionDto,
  UpdateConsignmentPayoutAmountDto,
  UpdateConsignmentStatusDto,
} from './dto/consignment.dto';

@ApiTags('consignment')
@Controller('adm/consignment')
@UseGuards(LegacyAdminOnlyJwtAuthGuard)
export class AdmConsignmentController {
  constructor(private readonly consignmentService: ConsignmentService) {}

  @Get('')
  @ApiResponse({ status: 200, type: ListConsignmentResponseDTO })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async list(
    @Req() request: { user: { userId: string } },
    @Query() query: ListConsignmentRequestDTO,
  ) {
    return this.consignmentService.list({
      ...query,
      ...{ userId: request.user.userId },
    });
  }

  @Patch(':id/status')
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: ConsignmentResponseDto,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateConsignmentStatusDto,
  ) {
    return this.consignmentService.updateStatus(
      updateStatusDto.status,
      id,
      null,
    );
  }

  @Patch(':id/payout-amount')
  @ApiResponse({
    status: 200,
    description: 'Payout amount updated successfully',
    type: ConsignmentResponseDto,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async updatePayoutAmount(
    @Param('id') id: string,
    @Body() updatePayoutAmountDto: UpdateConsignmentPayoutAmountDto,
  ) {
    return this.consignmentService.updatePayoutAmount(
      id,
      updatePayoutAmountDto,
    );
  }

  @HttpCode(200)
  @Post(':id/payout')
  @ApiResponse({
    status: 200,
    description: 'Payout submitted successfully',
    type: ConsignmentPayoutResponseDto,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async payout(
    @Req() request: { user: { userId: string } },
    @Param('id') id: string,
    @Body() updatePayoutAmountDto: UpdateConsignmentPayoutAmountDto,
  ) {
    return this.consignmentService.payout(
      id,
      request.user.userId,
      updatePayoutAmountDto.payoutAmount,
    );
  }

  @HttpCode(200)
  @Get(':id/payout/status')
  @ApiResponse({
    status: 200,
    description: 'Check Payout status',
    type: ConsignmentPayoutResponseDto,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async checkPayoutStatus(@Param('id') id: string) {
    return this.consignmentService.checkPayoutStatus(id);
  }

  @HttpCode(200)
  @Get(':id/payout/details')
  @ApiResponse({
    status: 200,
    description: 'Get Payout details',
    type: ConsignmentPayoutDetailsResponseDto,
  })
  @ApiHeader({
    name: 'token',
    description: 'Token from authorization API',
    required: true,
    schema: { type: 'string' },
  })
  async payoutDetails(@Param('id') id: string) {
    return this.consignmentService.getPayoutDetails(id);
  }

  @Patch(':id/product-condition')
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
  async updateConsignmentCondition(
    @Param('id') id: string,
    @Body() updateDto: UpdateConsignmentConditionDto,
  ) {
    return this.consignmentService.updateConsignmentCondition(
      id,
      updateDto.conditionId,
    );
  }
}
