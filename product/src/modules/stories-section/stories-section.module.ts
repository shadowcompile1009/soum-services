import { Module } from '@nestjs/common';
import { StoriesSectionController } from './stories-section.controller';
import { StoriesSectionService } from './stories-section.service';
import { ConfigModule } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { AmazonService } from '../aws/aws.service';

@Module({
  controllers: [StoriesSectionController],
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
  ],
  providers: [StoriesSectionService, AmazonService]
})
export class StoriesSectionModule {}
