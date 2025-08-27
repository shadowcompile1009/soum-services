import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { CitiesModule } from '../cities/cities.module';
import { RulesModule } from '../rules/rules.module';
import { UserTypesModule } from '../usertypes/usertypes.module';
import { VendorModule } from '../vendor/vendor.module';
import { ServiceModule } from '../service/service.module';

@Module({
  controllers: [GrpcController],
  imports: [
    CitiesModule,
    RulesModule,
    UserTypesModule,
    VendorModule,
    ServiceModule,
  ],
})
export class GrpcModule {}
