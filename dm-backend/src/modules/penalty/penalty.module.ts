import { Module } from '@nestjs/common';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Penalty, PenaltySchema } from './schemas/penalty.schema';
import { V2Module } from '../v2/v2.module';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [PenaltyController],
  providers: [PenaltyService],
  imports: [
    MongooseModule.forFeature([{ name: Penalty.name, schema: PenaltySchema }]),
    AuthModule,
    V2Module,
  ],
  exports: [PenaltyService],
})
export class PenaltyModule {}
