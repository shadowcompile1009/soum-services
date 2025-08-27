import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TamamModule } from './modules/tamam/tamam.module';
import { HyperpayModule } from './modules/hyperpay/hyperpay.module';
import { TorodController } from './modules/torod/torod.controller';
import { TorodService } from './modules/torod/torod.service';
import { TorodModule } from './modules/torod/torod.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TamamModule,
    HyperpayModule,
    TorodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
