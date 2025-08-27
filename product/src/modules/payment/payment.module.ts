import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import {
  PAYMENT_PACKAGE_NAME,
  protobufPackage,
} from '../grpc/proto/payment.pb';
import { PaymentService } from './payment.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
let grpcHost = '0.0.0.0:50055';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.PAYMENT_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  providers: [PaymentService],
  controllers: [],
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
export class PaymentModule {}
