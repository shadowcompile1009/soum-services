import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/database.config';
import { ReviewModule } from './modules/review/review.module';
import { RateModule } from './modules/rate/rate.module';
import { V2Module } from './modules/v2/v2.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.URI'),
      }),
    }),
    RateModule,
    ReviewModule,
    GrpcModule,
    V2Module,
    QuestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
