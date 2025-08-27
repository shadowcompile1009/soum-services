import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TamamController } from './tamam.controller';
import { TamamService } from './tamam.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TamamController],
  providers: [TamamService],
})
export class TamamModule {}
