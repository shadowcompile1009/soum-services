import { Module } from '@nestjs/common';
import { ImageSectionController } from './image-section.controller';
import { ImageSectionService } from './image-section.service';
import { AmazonService } from '../aws/aws.service';
import { ConfigModule } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { StockImageController } from './stock-image.controller';

@Module({
  controllers: [ImageSectionController, StockImageController],
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
  ],
  providers: [ImageSectionService, AmazonService],
})
export class ImageSectionModule {}
