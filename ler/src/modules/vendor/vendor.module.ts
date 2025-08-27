import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { VaultInstance } from '@src/libs/vault.util.ts';
import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from '../service/service.module';
import { V2Module } from '../v2/v2.module';
import { Shipment } from './entities/shipment.entity';
import { Vendor } from './entities/vendor.entity';
import { ShipmentService } from './shipment.service';
import { TorodShipmentService } from './torod/torod.service';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Vendor, Shipment] }),
    AuthModule,
    ServiceModule,
    V2Module,
  ],
  controllers: [VendorController],
  providers: [
    VendorService,
    TorodShipmentService,
    ShipmentService,
    VaultInstance,
  ],
  exports: [VendorService, ShipmentService],
})
export class VendorModule {}
