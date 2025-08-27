import { Module } from '@nestjs/common';
import { AddonModule } from './modules/addon/addon.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { GrpcModule } from './modules/grpc/grpc.module';
import { AppService } from './app.service';
import { V2Module } from './modules/v2/v2.module';

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
    AddonModule,
    V2Module,
    GrpcModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
