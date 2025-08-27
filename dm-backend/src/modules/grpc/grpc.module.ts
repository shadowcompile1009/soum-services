import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { PenaltyModule } from '../penalty/penalty.module';
import { CancellationFeeSettingsModule } from '../cancellation-fee-settings/cancellation-fee-settings.module';
import { V2Module } from '../v2/v2.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  controllers: [GrpcController],
  imports: [
    PenaltyModule,
    CancellationFeeSettingsModule,
    V2Module,
    OrdersModule,
  ], // Import modules here
})
export class GrpcModule {}
