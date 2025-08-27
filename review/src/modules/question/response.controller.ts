import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ResponseService } from './response.service';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { CreateResponseDto } from './dto/create-response.dto';

@Controller('response')
@ApiTags('Response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Get('/filter/:productId')
  @ApiOperation({ summary: 'Get all responses of a product' })
  @ApiParam({ name: 'productId', type: 'string', required: true })
  async getProductResponse(@Param('productId') productId: string) {
    const responseResult =
      await this.responseService.getProductResponse(productId);

    return responseResult;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() request: any,
    @Body() createResponseDto: CreateResponseDto,
  ) {
    const userId = request.user?.userId;
    console.log('🚀 ~ ResponseController ~ @Body ~ userId:', userId);
    createResponseDto.userId = userId;
    const responseData = await this.responseService.create(createResponseDto);

    return {
      message: 'Add response successfully',
      responseData,
    };
  }
}
