import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V2Module } from '@src/modules/v2/v2.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { HomepageModule } from './modules/homepage/homepage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    V2Module,
    HomepageModule,
    GrpcModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
