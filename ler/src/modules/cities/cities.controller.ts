import {
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import * as papa from 'papaparse';
import { CitiesService } from './cities.service';
import { Cities } from './entities/cities.entity';
import { CreateCitiesDto } from './dto/cities.dto';
import { LegacyAdminOnlyJwtAuthGuard } from '../auth/auth.guard';

@Controller('cities')
export class CitiesController {
  @Inject(CitiesService)
  private readonly citiesService: CitiesService;

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const stream = Readable.from(file.buffer);
    papa.parse(stream, {
      header: true,
      worker: true,
      delimiter: ',',
      step: async (row) => {
        const citiesReq: CreateCitiesDto = {
          name: row?.data['City Name (En)'],
          sellerTier: row?.data['Seller City Tier'],
          buyerTier: row?.data['Buyer City Tier'],
          arabicName: row?.data['City Name (Ar)'],
        };
        if (row?.data) {
          const cities = await this.citiesService.findAndUpdate(citiesReq);
          if (!cities) {
            await this.citiesService.create(citiesReq);
          }
        }
      },
    });
    return 'Import list cities and tiers successfully';
  }

  @Get()
  public find(): Promise<Cities[]> {
    return this.citiesService.find();
  }
}
