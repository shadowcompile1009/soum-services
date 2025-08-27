import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as papa from 'papaparse';
import { VendorService } from './vendor.service';
import { Readable } from 'node:stream';
import { Vendor } from './entities/vendor.entity';
import { ServiceService } from '../service/service.service';
import { MikroOrmIdDto } from './dto/valid-id.dto';
import { Service } from '../service/entities/service.entity';
import { JwtAuthGuard, LegacyAdminOnlyJwtAuthGuard } from '../auth/auth.guard';
import { V2Service } from '../v2/v2.service';
import { ShipmentService } from './shipment.service';
import { CreateShipmentReq } from '../grpc/proto/ler.pb';

@Controller('vendor')
export class VendorController {
  constructor(private readonly shipmentService: ShipmentService) {}
  @Inject(VendorService)
  private readonly vendorService: VendorService;
  @Inject(ServiceService)
  private readonly serviceService: ServiceService;
  @Inject(V2Service)
  private readonly v2Service: V2Service;

  @Post('/shipment')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  public CreateShipment(@Body() payload: CreateShipmentReq) {
    return this.shipmentService.createShipment(payload, 'torod');
  }
  @Get('/shipment')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  public getShipment(@Query() query: any) {
    const soumOrderNumber = query.soumOrderNumber;
    return this.shipmentService.getCreatedShipment(soumOrderNumber);
  }

  @Post('upload')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
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
      complete: async (row) => {
        for (const item of row?.data) {
          const services = [];
          const logisticServices = item['Logistics Services'].split(',');
          for (const logisticService of logisticServices) {
            let service = await this.serviceService.findOne(logisticService);
            if (!service) {
              service = await this.serviceService.create({
                name: logisticService,
                arabicName: logisticService,
              });
            }
            services.push(service?.id);
          }
          const vendor = await this.vendorService.findOne(
            item['Vendor Name (EN)'],
          );
          if (!vendor) {
            await this.vendorService.create({
              name: item['Vendor Name (EN)'],
              arabicName: item['Vendor Name (Ar)'],
              sellerTiers: item['Seller City Tiers'],
              buyerTiers: item['Buyer City Tiers'],
              services: services.toString(),
            });
          }
        }
      },
    });
    return true;
  }

  @Post('smsa/tracking/upload')
  @UseInterceptors(FileInterceptor('file'))
  async generateSMSATracking(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const stream = Readable.from(file.buffer);
      const json = new Promise(async (resolve, reject) => {
        papa.parse(stream, {
          header: true,
          worker: true,
          delimiter: ',',
          complete: async (row) => {
            const trackingData = [];
            for (const item of row?.data) {
              trackingData.push({
                id: item['SOUM ID'],
                inspectionStatus: item['Inspection Status'],
                inspectionCenter: item['Inspection Center'],
                trackingNumber: '',
              });
            }
            const response = await this.v2Service.generateSMSATracking({
              trackingData,
            });
            resolve(response);
          },
        });
      });
      const result = await json;
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  @Get()
  public find(): Promise<Vendor[]> {
    return this.vendorService.find();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getSpecificVendor(@Param() params: MikroOrmIdDto) {
    const vendor = await this.vendorService.findOneById(params.id);
    const serviceIds = vendor?.services?.split(',') || [];

    const services = await this.serviceService.find();
    const serviceMap = new Map<string, Service>();
    services.forEach((service: Service) => {
      serviceMap.set(service.id, service);
    });
    const serviceArr: Service[] = [];
    serviceIds.map((serviceId: string) => {
      if (serviceMap.has(serviceId)) {
        serviceArr.push(serviceMap.get(serviceId));
      }
      return serviceId;
    });
    return {
      ...vendor,
      services: serviceArr,
    };
  }
}
