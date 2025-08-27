import { Module, forwardRef } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectorAppInspectionController } from './inspector-app.inspection.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { VaultInstance } from '@src/utils/vault.util';
import { ProductModule } from '../product/product.module';
import { Specification } from './entity/Specification';
import { ProductInspectionSettings } from '../product/entity/product-inspection-settings.entity';
import { Category } from '../product/entity/category.entity';
import { SoumUser } from '../product/entity/user.entity';
import { SpecificationService } from './specification.service';
import { InspectorAppSpecificationController } from './inspector-app.specification.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Specification, ProductInspectionSettings, Category, SoumUser],
    }),
    forwardRef(() => ProductModule),
  ],
  controllers: [
    InspectorAppInspectionController,
    InspectorAppSpecificationController,
  ],
  exports: [InspectionService, SpecificationService],
  providers: [InspectionService, VaultInstance, SpecificationService],
})
export class InspectionModule {}
