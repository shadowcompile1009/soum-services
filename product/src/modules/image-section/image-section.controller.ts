import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { ImageSectionDto } from './dto/ImageSection.dto';
import { ImageSectionService } from './image-section.service';

@Controller('image-section')
export class ImageSectionController {
  constructor(private readonly service: ImageSectionService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: Number, name: 'offset' })
  @ApiQuery({ type: Number, name: 'limit' })
  async list(@Query() query: any) {
    const offset = +query.offset || 0;
    const limit = +query.limit || 100;
    const categoryId = query.categoryId || null;
    const sectionType = query.section || null;
    const isActive = query.isActive === 'true' || false;

    const filterObj = {
      categoryId,
      sectionType,
    };
    if (isActive) Object.assign(filterObj, { isActive: true });
    return this.service.filter(filterObj, limit, offset);
  }

  @Post()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async create(@Body() payload: ImageSectionDto, @Req() request: any) {
    return await this.service.create(payload, request?.user?.userId);
  }

  @Put(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updateFull(@Body() payload: ImageSectionDto, @Param() param: any) {
    payload.id = param.id;
    return await this.service.updateFull(payload);
  }

  @Delete(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async delete(@Param() param: any) {
    return await this.service.delete(param.id);
  }
}
