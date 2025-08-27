import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LegacyAdminJwtStrategy } from 'src/auth/strategies/legacy-admin-jwt.strategy';
import { PaginatedDto } from 'src/dto/paginated.dto';
import { AddonService } from 'src/modules/addon/addon.service';
import {
  AddonDto,
  AddonSummaryReqDto,
  AddonSummaryResDto,
  UpdateAddonDto,
} from './dto/addon.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddonFilter } from './schemas/addon.schema';
import { S3Service } from '../s3/s3.service';
@Controller('/')
@ApiTags('addon')
export class AddonController {
  constructor(
    private readonly service: AddonService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOkResponse({ type: PaginatedDto<AddonDto> })
  @ApiQuery({ type: Number, name: 'offset' })
  @ApiQuery({ type: Number, name: 'limit' })
  @ApiQuery({ type: String, name: 'modelId' })
  @ApiQuery({ type: Number, name: 'price' })
  async list(@Query() query: any) {
    const offset = +query.offset || 0;
    const limit = +query.limit || 100;
    const modelId = query.modelId || null;
    const price = query.price || null;

    const addonFilter: AddonFilter = {
      modelId: modelId,
      price: price,
    };

    return await this.service.findAll(
      {
        offset,
        limit,
      },
      addonFilter,
    );
  }

  @Post('/')
  @ApiOkResponse({ type: AddonDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload addon data',
    type: AddonDto,
  })
  @UseGuards(LegacyAdminJwtStrategy)
  @UseInterceptors(FileInterceptor('image'))
  @ApiHeader({ name: 'token', required: true })
  async create(
    @Body() payload: AddonDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (image) {
        const imgUrl = await this.s3Service.upload(image, 'addon');
        payload.image = imgUrl;
      }
      const res = await this.service.create(payload as AddonDto);
      if (res) {
        return {
          message: 'Addon added successfully',
        };
      } else {
        throw new BadRequestException('Failed to add addon');
      }
    } catch (err) {
      throw new BadRequestException(err?.message || 'Failed to add addon');
    }
  }

  @Post('/:productId/summary')
  @ApiOkResponse({ type: AddonSummaryResDto })
  @ApiBody({
    description: 'get addons summary`',
    type: AddonSummaryReqDto,
  })
  async summary(@Body() payload: AddonSummaryReqDto) {
    const res = await this.service.summary(payload);
    if (!res) {
      throw new BadRequestException('Failed to get addon summary');
    }
    return res;
  }

  @Put('/:id')
  @ApiOkResponse({})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Edit addon',
    type: UpdateAddonDto,
  })
  @UseGuards(LegacyAdminJwtStrategy)
  @UseInterceptors(FileInterceptor('image'))
  @ApiHeader({ name: 'token', required: true })
  async partialUpdate(
    @Body() payload: UpdateAddonDto,
    @UploadedFile() image: Express.Multer.File,
    @Param() params: any,
  ) {
    try {
      if (!params.id)
        throw new BadRequestException('Id should be passed for update request');
      const updateObject = payload as UpdateAddonDto;
      const id = params.id;
      if (image) {
        const imgUrl = await this.s3Service.upload(image, 'addon');
        payload.image = imgUrl;
      }
      return await this.service.update(id, updateObject);
    } catch (err) {
      throw new BadRequestException(err?.message || 'Failed to update addon');
    }
  }

  @Delete('/:addonId')
  @UseGuards(LegacyAdminJwtStrategy)
  @ApiParam({
    name: 'addonId',
    required: true,
    description: 'ID of the addon to be deleted',
  })
  @ApiHeader({ name: 'token', required: true })
  async remove(@Param() params: any) {
    if (!params.addonId)
      throw new BadRequestException('Id should be passed for delete request');
    await this.service.remove(params.addonId);
    return {
      massage: 'addon was deleted',
    };
  }

  @Get('/status')
  async getStatus() {
    return { status: 'OK' };
  }
}
