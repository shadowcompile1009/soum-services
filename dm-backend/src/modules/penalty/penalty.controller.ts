import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { PenaltyService } from './penalty.service';

@Controller('penalty')
@ApiTags('Penalty')
export class PenaltyController {
  constructor(private readonly service: PenaltyService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getHoldingPenaltyBalance(@Req() request: any) {
    const userId = request.user.userId;
    return this.service.getHoldingPenaltyBalance(userId);
  }

  @Get('/new-added-charge')
  @UseGuards(JwtAuthGuard)
  async getNewAddedPenalty(@Req() request: any) {
    const userId = request.user.userId;
    return this.service.getNewAddedPenalty(userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getPenaltyPerDMO(@Param() params: MongoIdDto) {
    const dmoId = params?.id;
    return this.service.getPenaltyPerDMO(dmoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addNewPenaltyToHoldingBalance(
    @Body() createPenaltyDto: CreatePenaltyDto,
  ) {
    return this.service.create(createPenaltyDto);
  }

  @Put('/deduct-penalty')
  @UseGuards(JwtAuthGuard)
  async deductHoldingPenaltyBalance(@Body() penaltyDto: CreatePenaltyDto) {
    return this.service.deductHoldingPenaltyBalance(penaltyDto.userId);
  }
}
