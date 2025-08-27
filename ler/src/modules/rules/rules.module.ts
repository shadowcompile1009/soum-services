import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { UserTypesModule } from '../usertypes/usertypes.module';
import { VendorModule } from '../vendor/vendor.module';
import { ServiceModule } from '../service/service.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Rules } from './entities/rules.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Rules] }),
    UserTypesModule,
    VendorModule,
    ServiceModule,
  ],
  providers: [RulesService],
  controllers: [RulesController],
  exports: [RulesService],
})
export class RulesModule {}
