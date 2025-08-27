import { Module } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { HomepageController } from './homepage.controller';
import { ConfigModule } from '@nestjs/config';
import { V2Module } from '../v2/v2.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    V2Module,
    CategoryModule,
  ],
  controllers: [HomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}
