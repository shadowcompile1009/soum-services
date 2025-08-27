import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AmazonService } from './aws.service';
import { ConfigModule } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';

@Module({
  controllers: [AwsController],
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
  ],
  providers: [AmazonService],
})
export class AwsModule {}