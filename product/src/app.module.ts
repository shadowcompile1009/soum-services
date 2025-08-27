import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbService } from './config/database.config';
import kafkaConfig from './config/kafka.config';
import { KafkaModule } from './kafka/kafka.module';
import { AwsModule } from './modules/aws/aws.module';
import { EmailModule } from './modules/email/email.module';
import { ConsignmentModule } from './modules/consignment/consignment.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { ImageSectionModule } from './modules/image-section/image-section.module';
import { ProductViewModule } from './modules/product-views/product-views.module';
import { ProductModule } from './modules/product/product.module';
import { StoriesSectionModule } from './modules/stories-section/stories-section.module';
import { ProductViewsConsumer } from './product-views.consumer';
import { InspectionModule } from './modules/inspection/inspection.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(dbService.getConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
    ProductViewModule,
    KafkaModule,
    GrpcModule,
    ImageSectionModule,
    AwsModule,
    ProductModule,
    EmailModule,
    ConsignmentModule,
    StoriesSectionModule,
    InspectionModule,
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
    }),
  ],
  providers: [ProductViewsConsumer],
})
export class AppModule {}
