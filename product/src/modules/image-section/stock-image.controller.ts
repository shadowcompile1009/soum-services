import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiParam, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { ImageSectionService } from './image-section.service';
import { StockImageDto } from './dto/stockImage.dto';

@ApiTags('Stock Images') // Adds a tag for grouping in Swagger
@Controller('stock-image')
export class StockImageController {
  constructor(private readonly service: ImageSectionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'offset', type: Number, required: false, example: 0 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 100 })
  async listStockImages(
    @Query() { offset = 0, limit = 100 }: { offset: number; limit: number },
  ) {
    return this.service.filterStockImages(null, limit, offset);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'Stock image ID' })
  @ApiBody({ type: StockImageDto })
  async updateFullStockImages(
    @Body() payload: StockImageDto,
    @Param('id') id: string,
  ) {
    payload.id = id;
    return await this.service.updateStockImagesFull(payload);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: StockImageDto })
  async createStockImages(@Body() payload: StockImageDto) {
    return await this.service.createStockImage(payload);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'Stock image ID' })
  async deleteStockImage(@Param('id') id: string) {
    return await this.service.deleteStockImage(id);
  }
}
