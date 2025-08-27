import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Post,
  Put,
  Delete,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AttributeService } from './attribute.service';
import {
  CreateAttributeDto,
  DeleteAttributeDto,
  GetAttributeDto,
  UpdateAttributeDto,
} from './dto/attribute.dto';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { Attribute } from './entities/attribute';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { deleteWithPattern } from '@src/utils/redis';
import { CacheConstant } from '@src/constants/cache.constant';

@Controller('/attribute')
@ApiTags('Attributes')
export class AttributeController {
  @Inject(AttributeService)
  private readonly attributeService: AttributeService;

  @Get('/')
  @ApiTags('Attributes')
  @ApiOperation({
    summary:
      'Get Attributes with size and page for pagination. You can use search param to search by attribute name. The new optionIncluded is true if you need to have the options of the attribute in the response',
  })
  @ApiQuery({ name: 'size', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiQuery({ name: 'optionsIncluded', type: 'boolean', required: false })
  @ApiOkResponse({ type: PaginatedDto<Attribute> })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(JwtAuthGuard)
  async getAttributes(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('search') search: string,
    @Query('optionsIncluded') optionsIncluded: boolean,
  ): Promise<PaginatedDto<Attribute>> {
    const attributesData = await this.attributeService.getAttributes({
      page,
      size,
      search,
      optionsIncluded,
    });

    return {
      items: attributesData.attributes,
      total: attributesData.count,
      limit: size,
      offset: (page - 1) * size,
    };
  }

  @Get('/:attributeId')
  @ApiTags('Attributes')
  @ApiOperation({
    summary: 'Get Attribute with its options by attribute id',
  })
  @ApiHeader({ name: 'token', required: true })
  @ApiParam({ name: 'attributeId', type: 'string' })
  @ApiOkResponse({ type: Attribute })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getAttribute(@Param() params: GetAttributeDto): Promise<any> {
    const attribute = await this.attributeService.getAttributeById({
      id: params.attributeId,
    });
    if (!attribute) {
      throw new NotFoundException('Attribute ID unavailable');
    }

    return {
      message: 'Get Attribute successfully',
      result: attribute,
    };
  }

  @Post('/')
  @ApiTags('Attributes')
  @ApiOperation({
    summary: 'Create Attribute',
  })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async addAttribute(@Body() params: CreateAttributeDto): Promise<any> {
    const attribute = await this.attributeService.insertAttribute(params);
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);

    return {
      message: 'Create Attribute successfully',
      result: attribute,
    };
  }

  @Delete('/:attributeId')
  @ApiTags('Attributes')
  @ApiOperation({
    summary: 'Delete Attribute',
  })
  @ApiParam({ name: 'attributeId', type: 'string' })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async deleteAttribute(@Param() params: DeleteAttributeDto): Promise<any> {
    const attribute = await this.attributeService.deleteAttribute(
      params.attributeId,
    );
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);

    return {
      message: 'Delete Attribute successfully',
      result: attribute,
    };
  }

  @Put('/:attributeId')
  @ApiTags('Attributes')
  @ApiOperation({
    summary: 'Update Attributes',
  })
  @ApiParam({ name: 'attributeId', type: 'string' })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updateAttribute(
    @Param() params: GetAttributeDto,
    @Body() body: UpdateAttributeDto,
  ): Promise<any> {
    const attribute = await this.attributeService.updateAttributeById(
      params.attributeId,
      body,
    );

    if (!attribute) {
      throw new NotFoundException('Attribute ID unavailable');
    }
    await deleteWithPattern(`${CacheConstant.VARIANT_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.BASE_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.FILTER_ATTRIBUTES}*`);
    await deleteWithPattern(`${CacheConstant.OPTIONS}*`);

    return {
      message: 'Update Attribute successfully',
      result: attribute,
    };
  }
}
