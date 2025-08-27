import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '@src/config/database.config';
import { V2Module } from '@src/modules/v2/v2.module';
import { AppleModule } from './modules/apple/apple.module';
import { GrpcModule } from './modules/grpc/grpc.module';

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
    V2Module,
    AppleModule,
    GrpcModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
