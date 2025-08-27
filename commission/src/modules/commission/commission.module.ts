import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Commission, CommissionSchema } from './schemas/commission.schema';
import { DynamicCommission, DynamicCommissionSchema } from './schemas/dynamic-commission.schema';
import { AuthModule } from 'src/auth/auth.module';
import { DynamicCommissionService } from './services/dynamic-commission.service';
import { HttpModule } from '@nestjs/axios';
import { CommissionCalculationService } from '../product-commission/commission-calculation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commission.name, schema: CommissionSchema },
      { name: DynamicCommission.name, schema: DynamicCommissionSchema },
    ]),
    HttpModule,
    AuthModule
  ],
  controllers: [CommissionController],
  providers: [CommissionService, DynamicCommissionService, CommissionCalculationService],
  exports: [DynamicCommissionService, CommissionCalculationService],
})
export class CommissionModule {}
