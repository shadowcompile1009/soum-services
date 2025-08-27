import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { dbService } from './config/db.config';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from './modules/cities/cities.module';
import { RulesModule } from './modules/rules/rules.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { UserTypesModule } from './modules/usertypes/usertypes.module';
import { V2Module } from './modules/v2/v2.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(dbService.getConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserTypesModule,
    RulesModule,
    CitiesModule,
    VendorModule,
    GrpcModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    V2Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
