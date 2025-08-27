import { Module } from '@nestjs/common';
import { CategoryConditionController } from './category-condition.controller';
import { CategoryConditionService } from './category-condition.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { V2Module } from '../v2/v2.module';
import { CategoryCondition } from './entities/category-condition';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [CategoryCondition] }),
    V2Module,
  ],
  controllers: [CategoryConditionController],
  providers: [CategoryConditionService],
  exports: [CategoryConditionService],
})
export class CategoryConditionModule {}
