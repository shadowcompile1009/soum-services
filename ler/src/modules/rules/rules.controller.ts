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
import { RulesService } from './rules.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import * as papa from 'papaparse';
import { CreateRulesDto } from './dto/rules.dto';
import { UserTypesService } from '../usertypes/usertypes.service';
import { VendorService } from '../vendor/vendor.service';
import { ServiceService } from '../service/service.service';
import { CreateVendorDto } from '../vendor/dto/vendor.dto';
import { Rules } from './entities/rules.entity';
import { LegacyAdminOnlyJwtAuthGuard } from '../auth/auth.guard';

@Controller('rules')
export class RulesController {
  @Inject(RulesService)
  private readonly rulesService: RulesService;
  @Inject(UserTypesService)
  private readonly userTypesService: UserTypesService;
  @Inject(VendorService)
  private readonly vendorService: VendorService;
  @Inject(ServiceService)
  private readonly serviceService: ServiceService;

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
    return new Promise((resolve, reject) => {
      const stream = Readable.from(file.buffer);
      papa.parse(stream, {
        header: true,
        worker: true,
        delimiter: ',',
        complete: async (row) => {
          for (const item of row.data) {
            const sellerType = item['Seller Type'];
            let userType = await this.userTypesService.findOne(sellerType);
            if (!userType) {
              userType = await this.userTypesService.create({
                name: sellerType,
              });
            }

            const services = [];
            const logisticService = item['Logistics Service'];
            let service = await this.serviceService.findOne(logisticService);
            if (!service) {
              service = await this.serviceService.create({
                name: logisticService,
                arabicName: logisticService,
              });
            }
            services.push(service?.id);

            const logisticVendorRow = item['Logistics Vendor'];
            const logisticVendor: CreateVendorDto = {
              name: logisticVendorRow,
              arabicName: logisticVendorRow,
              sellerTiers: item['Seller City Tier'],
              buyerTiers: item['Buyer City Tier'],
              services: services.toString(),
            };
            let vendor = await this.vendorService.findAndUpdate(logisticVendor);
            if (!vendor) {
              vendor = await this.vendorService.create(logisticVendor);
            }

            const citiesReq: CreateRulesDto = {
              userType: userType,
              sellerTier: item['Seller City Tier'],
              buyerTier: item['Buyer City Tier'],
              vendor: vendor,
            };
            const rules = await this.rulesService.findOne(citiesReq);
            if (!rules) {
              await this.rulesService.create(citiesReq);
            }
          }
          resolve('Import logistics rules successfully');
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  @Get()
  public find(): Promise<Rules[]> {
    return this.rulesService.find();
  }
}
