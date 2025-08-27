import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@src/config/database.config';
import { V2Module } from '@src/modules/v2/v2.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    V2Module,
    GrpcModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
