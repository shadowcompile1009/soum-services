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
import { CustomException } from '@src/custom-exception';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { deleteWithPattern, getCache, setCache } from '@src/utils/redis';
import { CustomCodeErrors } from '../product/enum/customErrorCodes.enum';
import { FilterStoryDto, StoriesSectionDto } from './dto/storiesSection.dto';
import { StoriesSectionService } from './stories-section.service';

@Controller('story-section')
export class StoriesSectionController {
  constructor(private readonly service: StoriesSectionService) {}

  @Get()
  @ApiQuery({ type: Number, name: 'offset', required: false })
  @ApiQuery({ type: Number, name: 'limit', required: false })
  @ApiQuery({ type: String, name: 'date', required: false })
  @ApiQuery({ type: String, name: 'search', required: false })
  async list(@Req() request: any, @Query() query: any) {
    try {
      const offset = +query.offset || 0;
      const limit = +query.limit || 10;
      const date = query?.date || null;
      const search = query?.search || '';
      const key = `stories-section-${limit}-${offset}-${date}-${search}`;
      let stories = await getCache<any>(key);
      if (stories === null || stories === undefined) {
        stories = await this.service.filter(
          {
            date,
            search,
            clientId: request?.headers['client-id'],
          } as FilterStoryDto,
          limit,
          offset,
        );
        await setCache(key, stories, 60 * 60);
      }
      return stories;
    } catch (error) {
      console.log('🚀 ~ StoriesSectionController ~ list ~ error:', error);
      return {
        items: [],
        total: 0,
        limit: 10,
        offset: 0,
      } as PaginatedDto<StoriesSectionDto>;
    }
  }

  @Get(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async get(@Param() param: any) {
    const storyId = param.id;
    return this.service.get(storyId);
  }

  @Post()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async create(@Body() payload: StoriesSectionDto) {
    try {
      const data = await this.service.create(payload);
      deleteWithPattern('stories-section-*');
      return data;
    } catch (error) {
      console.log('🚀 ~ StoriesSectionController ~ create ~ error:', error);
      throw new CustomException(CustomCodeErrors.CREATE_OPERATION_FAILED);
    }
  }

  @Put('/position')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updatePosition(@Body() payload: StoriesSectionDto[]) {
    try {
      const updatedPosition = await this.service.updatePosition(payload);
      deleteWithPattern('stories-section-*');
      return updatedPosition;
    } catch (error) {
      console.log(
        '🚀 ~ StoriesSectionController ~ updatePosition ~ error:',
        error,
      );
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateFull(@Body() payload: StoriesSectionDto, @Param() param: any) {
    try {
      payload.id = param.id;
      const updatedStories = await this.service.update(payload);
      deleteWithPattern('stories-section-*');
      return updatedStories;
    } catch (error) {
      console.log('🚀 ~ StoriesSectionController ~ error:', error);
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }

  @Delete(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async delete(@Param() param: any) {
    try {
      await this.service.delete(param.id);
      deleteWithPattern('stories-section-*');
      return;
    } catch (error) {
      console.log('🚀 ~ StoriesSectionController ~ delete ~ error:', error);
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }
}
