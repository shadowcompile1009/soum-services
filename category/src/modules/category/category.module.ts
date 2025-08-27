import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from '@src/auth/auth.module';
import { V2Module } from '../v2/v2.module';
import { Category } from './entities/category';
import { CategoryAppController } from './category.app.controller';
import { AdminCategoryController } from './category.adm.controller';
import { CategoryProducerService } from '@src/kafka/product.producer';
import { CategoryWebController } from './category.web.controller';
import { CategoryAttribute } from './entities/categoryAttribute';
import { InspectorCategoryController } from './category.inspector.controller';
@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forFeature({ entities: [Category, CategoryAttribute] }),
    V2Module,
  ],
  controllers: [
    CategoryController,
    CategoryAppController,
    AdminCategoryController,
    CategoryWebController,
    InspectorCategoryController,
  ],
  providers: [CategoryService, CategoryProducerService],
  exports: [CategoryService],
})
export class CategoryModule {}
