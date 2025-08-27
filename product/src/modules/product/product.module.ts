import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { KafkaModule } from '@src/kafka/kafka.module';
import { WebEngageProducerService } from '@src/kafka/webEngage.producer';
import { VaultInstance } from '@src/utils/vault.util';
import { redisStore } from 'cache-manager-redis-yet';
import { AmazonService } from '../aws/aws.service';
import { CategoryModule } from '../category/category.module';
import { CommissionModule } from '../commission/commission.module';
import { ImageSectionService } from '../image-section/image-section.service';
import { ReviewModule } from '../review/review.module';
import { V2Module } from '../v2/v2.module';
import { AdminUpdateProductService } from './adminUpdateProduct.service';
import { CreateProductService } from './createProduct.service';
import { ProductInspectionSettings } from './entity/product-inspection-settings.entity';
import { Product } from './entity/product.entity';
import { ProductAction } from './entity/productActions.entity';
import { ProductImageSection } from './entity/productImageSection.entity';
import { Settings } from './entity/settings.entity';
import { ProductInspectionSettingsService } from './product-inspection-settings.service';
import { ProductCommissionService } from './product.commission.service';
import { ProductController } from './product.controller';
import { ProductInspectorAppController } from './productInspectorApp.controller';
import { ProductService } from './product.service';
import { ProductImageService } from './productImageSec.service';
import { SettingService } from './setting.service';
import { UserUpdateProductService } from './userUpdateProduct.service';
import { BullMQService } from './util/bullmq.util';
import { ViewProductService } from './viewProduct.service';
import { InspectionModule } from '../inspection/inspection.module';
import { SoumUser } from './entity/user.entity';
import { Category } from './entity/category.entity';
import { SystemUpdateProductService } from './systemUpdateProduct.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
    MikroOrmModule.forFeature({
      entities: [
        Product,
        SoumUser,
        Category,
        Settings,
        ProductAction,
        ProductImageSection,
        ProductInspectionSettings,
      ],
    }),
    CategoryModule,
    V2Module,
    CommissionModule,
    ReviewModule,
    KafkaModule,
    forwardRef(() => InspectionModule),
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [
    CreateProductService,
    ViewProductService,
    ProductService,
    AdminUpdateProductService,
    WebEngageProducerService,
    BullMQService,
    ProductImageService,
    ProductInspectionSettingsService,
    ImageSectionService,
    AmazonService,
    UserUpdateProductService,
    ProductCommissionService,
    SettingService,
    SystemUpdateProductService,
    VaultInstance,
  ],
  controllers: [ProductController, ProductInspectorAppController],
  exports: [
    ProductImageService,
    ProductService,
    CreateProductService,
    AdminUpdateProductService,
    SystemUpdateProductService,
    VaultInstance,
  ],
})
export class ProductModule {}
