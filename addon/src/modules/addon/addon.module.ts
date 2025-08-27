import { Module } from '@nestjs/common';
import { AddonService } from './addon.service';
import { AddonController } from './addon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Addon, AddonSchema } from './schemas/addon.schema';
import { S3Module } from '../s3/s3.module';
import { V2Module } from '../v2/v2.module';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Addon.name, schema: AddonSchema }]),
    AuthModule,
    V2Module,
    CommissionModule,
    S3Module,
  ],
  controllers: [AddonController],
  providers: [AddonService],
  exports: [AddonService],
})
export class AddonModule {}
