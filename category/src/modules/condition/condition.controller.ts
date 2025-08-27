import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConditionService } from './condition.service';
import { ConditionDto, ConditionForCsv } from './dto/condition.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteWithPattern, getCache, setCache } from '@src/utils/redis';
import _isEmpty from 'lodash/isEmpty';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { LegacyAdminJwtStrategy } from '@src/auth/strategies/legacy-admin-jwt.strategy';
import { CategoryConditionForCSV } from '../category-condition/dto/category-condition.dto';
import { Readable } from 'stream';
import { CsvParser } from 'nest-csv-parser';
import { ParamActionValues } from './dto/param.dto';
import { BullMQService, Queues } from '@src/utils/bullMQ.service';

@Controller('condition')
export class ConditionController {
  constructor(
    private readonly service: ConditionService,
    private readonly csvParser: CsvParser,
    private bullMQService: BullMQService,
  ) {}

  @Get()
  async list(@Query() query: any) {
    const key = `conditions_
      ${query.offset || 0}_
      ${query.limit || 10}_
      ${query?.categoryId}_
      ${query?.isPreset}`;
    const cachedConditions = await getCache<any>(key);
    if (!_isEmpty(cachedConditions)) {
      return cachedConditions;
    }
    const conditions = await this.service.getList(
      { categoryId: query?.categoryId, isPreset: query?.isPreset || false },
      Number(query.offset || 0),
      Number(query.limit || 10),
    );
    const oneDayInMs = 24 * 60 * 60;

    await setCache(key, conditions, oneDayInMs); // 24 hours
    return conditions;
  }
  @Get(':id')
  getById(@Param() params: ParamActionValues) {
    return this.service.getById(params?.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  @Post()
  create(@Body() body: ConditionDto) {
    deleteWithPattern('conditions*');
    deleteWithPattern('category_condition*');
    return this.service.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  update(@Param() params: any, @Body() body: ConditionDto) {
    deleteWithPattern('conditions*');
    deleteWithPattern(`condition_${params?.id}*`);
    deleteWithPattern('category_condition*');
    deleteWithPattern(`product_condition_${params?.id}*`);
    body.id = params?.id;
    return this.service.update(body);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  @Delete(':id')
  delete(@Param() params: any) {
    deleteWithPattern('conditions*');
    deleteWithPattern('category_condition*');
    deleteWithPattern(`product_condition_${params?.id}*`);
    deleteWithPattern(`condition_${params?.id}*`);
    return this.service.delete(params?.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image: Express.Multer.File) {
    return this.service.uploadImage(image);
  }

  @Post('/migration/category-condition/upload-csv')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsVFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(csv)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const stream = Readable.from(file.buffer);
      const { list } = await this.csvParser.parse(
        stream,
        CategoryConditionForCSV,
        null,
        null,
        { strict: true, separator: ',' },
      );

      if (list.length > 1000)
        throw new BadRequestException('Plz limit number of rows to be max 1k');
      list.forEach((element, index) => {
        this.bullMQService.addJob(
          element,
          {
            delay: index * 100,
            removeOnComplete: true,
          },
          Queues.CATEGORY_CONDITION_UPDATE,
        );
      });

      return {
        message: 'Update jobs promise started',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/migration/upload-csv')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadConditionCsVFile(@UploadedFile() file: Express.Multer.File) {
    const stream = Readable.from(file.buffer);
    const { list } = await this.csvParser.parse(
      stream,
      ConditionForCsv,
      null,
      null,
      { strict: true, separator: ',' },
    );
    return this.service.migrate(list as ConditionForCsv[]);
  }
}
