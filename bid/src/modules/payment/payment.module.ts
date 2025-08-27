import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import {
  protobufPackage,
  PAYMENT_PACKAGE_NAME,
} from '../grpc/proto/payment.pb';

let grpcHost = '0.0.0.0:50054';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.PAYMENT_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [
    ClientsModule.register([
      {
        name: PAYMENT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/payment.proto'),
        },
      },
    ]),
  ],
  exports: [PaymentService],
})
@Module({})
export class PaymentModule {}
