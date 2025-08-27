import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  COMMISSION_PACKAGE_NAME,
  protobufPackage,
} from '../grpc/proto/commission.pb';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
let grpcHost = '0.0.0.0:50053';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.COMMISSION_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  imports: [
    ClientsModule.register([
      {
        name: COMMISSION_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/commission.proto'),
        },
      },
    ]),
  ],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}
