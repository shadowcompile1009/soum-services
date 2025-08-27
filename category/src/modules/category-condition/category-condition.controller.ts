import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CategoryConditionService } from './category-condition.service';
import { deleteWithPattern } from '@src/utils/redis';
import { UpdateCategoryConditionDto } from './dto/update-category-condition.dto';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
@Controller('category-condition')
export class CategoryConditionController {
  constructor(private readonly service: CategoryConditionService) {}
  @Get()
  list(@Query() query: any) {
    const filter = {
      categoryId: query.variantId,
    };
    return this.service.getListWithCondition(
      filter,
      query.offset || 0,
      query.limit || 100,
    );
  }

  @Put(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  create(@Param() params: any, @Body() body: UpdateCategoryConditionDto) {
    deleteWithPattern('category_condition*');
    body.id = params?.id;
    return this.service.update(body);
  }
}
