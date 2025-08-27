import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateOptionDto,
  DeleteOptionDto,
  GetOptionDto,
  UpdateOptionDto,
} from './dto/option.dto';
import { OptionService } from './option.service';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { Option } from './entities/option';
import {
  createKey,
  deleteWithPattern,
  getCache,
  setCache,
} from '@src/utils/redis';
import { CacheConstant } from '@src/constants/cache.constant';

@Controller('/option')
@ApiTags('Options')
export class OptionController {
  @Inject(OptionService)
  private readonly optionService: OptionService;

  @Get('/')
  @ApiTags('Options')
  @ApiOperation({
    summary: 'Get Options with size and page',
  })
  @ApiQuery({ name: 'size', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'attributeId', type: 'string', required: true })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(JwtAuthGuard)
  async getOptions(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('attributeId') attributeId: string,
    @Query('search') search: string,
  ) {
    const key = createKey(CacheConstant.OPTIONS, [
      `${attributeId}`,
      `${page}`,
      `${size}`,
    ]);
    let optionsData = (await getCache(key)) as unknown as {
      options: Option[];
      count: number;
    };

    if (optionsData == null || optionsData == undefined) {
      optionsData = await this.optionService.getOptions({
        page,
        size,
        attributeId,
        search,
      });

      await setCache(key, optionsData, 300);
    }

    return {
      message: 'Get Options successfully',
      result: { options: optionsData.options, totalNumber: optionsData.count },
    };
  }

  @Get('/:optionId')
  @ApiTags('Options')
  @ApiOperation({
    summary: 'Get Option by id',
  })
  @ApiParam({ name: 'optionId', type: 'string' })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getOption(@Param() params: GetOptionDto): Promise<any> {
    const option = await this.optionService.getOptionById(params);
    if (!option) {
      throw new NotFoundException('Option ID unavailable');
    }

    return {
      message: 'Get Option successfully',
      result: option,
    };
  }

  @Post('/')
  @ApiTags('Options')
  @ApiOperation({
    summary: 'Create Option',
  })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async addOption(@Body() params: CreateOptionDto): Promise<any> {
    const option = await this.optionService.createOption(params);
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);

    return {
      message: 'Create Option successfully',
      result: option,
    };
  }

  @Delete('/:optionId')
  @ApiTags('Options')
  @ApiOperation({
    summary: 'Delete Option',
  })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiParam({ name: 'optionId', type: 'string' })
  async deleteOption(@Param() params: DeleteOptionDto): Promise<any> {
    const option = await this.optionService.deleteOption(params);
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);

    return {
      message: 'Delete Option successfully',
      result: option,
    };
  }

  @Put('/:optionId')
  @ApiTags('Options')
  @ApiOperation({
    summary: 'Update Option',
  })
  @ApiParam({ name: 'optionId', type: 'string' })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updateOption(
    @Param() optionId,
    @Body() params: UpdateOptionDto,
  ): Promise<any> {
    const option = await this.optionService.updateOption(optionId, params);
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);

    return {
      message: 'Update Option successfully',
      result: option,
    };
  }

  @Put('/cron/position')
  @ApiTags('Options')
  @ApiOperation({
    summary: 'Update Option Positions',
  })
  async updateOptionPosition(): Promise<any> {
    const option = await this.optionService.updateOptionPosition();
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);
    await deleteWithPattern(`${CacheConstant.ALL_ATTRIBUTES}*`);

    return {
      message: 'Update Option position successful',
      result: option,
    };
  }
}
