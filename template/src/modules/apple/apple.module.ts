import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/auth/auth.module';
import { V2Module } from '../v2/v2.module';
import { AppleController } from './apple.controller';
import { AppleService } from './apple.service';
import { Apple, AppleSchema } from './schemas/apple.schema';

@Module({
  providers: [AppleService],
  controllers: [AppleController],
  imports: [
    MongooseModule.forFeature([{ name: Apple.name, schema: AppleSchema }]),
    AuthModule,
    V2Module,
  ],
  exports: [AppleService],
})
export class AppleModule {}
