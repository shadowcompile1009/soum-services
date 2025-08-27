import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListBySellerDto } from '@src/modules/commission/dto/listBySeller.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { LegacyAdminJwtStrategy } from 'src/auth/strategies/legacy-admin-jwt.strategy';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { CommissionService } from 'src/modules/commission/commission.service';
import { CommissionDto } from 'src/modules/commission/dto/createCommission.dto';
import { CommissionAnalysis } from '../product-commission/schemas/product-commission.schema';
import { UserType } from './enum/userSellerType.enum';
import { DynamicCommissionService } from './services/dynamic-commission.service';

@Controller('/')
@ApiTags('commission')
export class CommissionController {
  constructor(
    private readonly service: CommissionService,
    private readonly dynamicCommissionService: DynamicCommissionService,
  ) {}

  @Get('/sellers-type')
  async listSellerTypes() {
    return [
      {
        name: UserType.ALL_SELLERS,
        key: UserType.ALL_SELLERS,
      },
      {
        name: UserType.INDIVIDUAL_SELLER,
        key: UserType.INDIVIDUAL_SELLER,
      },
      {
        name: UserType.KEY_SELLER,
        key: UserType.KEY_SELLER,
      },
      {
        name: UserType.MERCHANT_SELLER,
        key: UserType.MERCHANT_SELLER,
      },
      {
        name: UserType.UAE_SELLER,
        key: UserType.UAE_SELLER,
      },
    ];
  }

  @Get()
  @ApiOkResponse({ type: PaginatedDto<CommissionDto> })
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  @ApiQuery({ type: Number, name: 'offset' })
  @ApiQuery({ type: Number, name: 'limit' })
  @ApiQuery({ enum: UserType, name: 'userType' })
  @ApiQuery({ type: Boolean, name: 'isBuyer' })
  @ApiQuery({ type: Boolean, name: 'categoryId' })
  async list(@Query() query: any) {
    const offset = +query.offset || 0;
    const limit = +query.limit || 100;
    const userType = query.userType || null;
    const categoryId = query.categoryId || null;
    const isBuyer = query.isBuyer == 'true' || false;

    return await this.service.findAll({
      offset,
      limit,
      userType,
      isBuyer,
      categoryId,
    });
  }

  @Post()
  @ApiOkResponse({ type: CommissionDto })
  @ApiBody({ type: CommissionDto })
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  async create(@Body() payload: CommissionDto, @Req() request: any) {
    return await this.service.create(
      payload as CommissionDto,
      request.user.userName,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: PaginatedDto })
  @ApiBody({ type: CommissionDto })
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  async partialUpdate(
    @Body() payload: CommissionDto,
    @Param() params: any,
    @Req() request: any,
  ) {
    if (!params.id)
      throw new BadRequestException('Id should be passed for patch request');
    const updateObject = payload as CommissionDto;
    updateObject.id = params.id;
    return await this.service.update(updateObject, request.user.userName);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  async remove(@Param() params: any, @Req() request: any) {
    if (!params.id)
      throw new BadRequestException('Id should be passed for patch request');
    await this.service.remove(params.id, request.user.userName);
    return {
      massage: 'Commission was deleted',
    };
  }

  @Get('/seller')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  @ApiQuery({ type: String, name: 'categoryId' })
  @ApiQuery({
    type: String,
    name: 'sellerType',
    enum: [UserType.KEY_SELLER, UserType.MERCHANT_SELLER, UserType.UAE_SELLER],
  })
  @ApiOkResponse({ type: CommissionAnalysis })
  async getSellerCommissions(@Query() query: ListBySellerDto) {
    return await this.service.getSellerCommissions({
      categoryId: query.categoryId,
      userType: query.sellerType || UserType.INDIVIDUAL_SELLER,
    });
  }

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Put('/dynamic-commission')
  async updateDynamicCommissions() {
    try {
      const lastRecord = await this.dynamicCommissionService.getLastRecord();
      // i put it null to validate the logic
      const response = await this.dynamicCommissionService.checkFileAndReadIfChanged(lastRecord?.etag);
      
      if (response.updated && response.data?.length) {
        await this.dynamicCommissionService.updateDynamicCommissions(response.data, response.etag);
        return { success: true, message: `Updated ${response.data.length} records` };
      }
      
      return { success: true, message: 'No updates needed' };
    } catch (error) {
      throw new BadRequestException(`Failed to update dynamic commissions: ${error.message}`);
    }
  }
}
