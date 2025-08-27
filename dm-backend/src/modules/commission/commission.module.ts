import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommissionService } from './commission.service';
import {
  COMMISSION_PACKAGE_NAME,
  protobufPackage,
} from '../grpc/proto/commission.pb';
import { join } from 'path';

let grpcHost = '0.0.0.0:50053';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.COMMISSION_SVC}-${process.env.PREFIX}-srv:50051`;
}

@Module({
  providers: [CommissionService],
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
  exports: [CommissionService],
})
export class CommissionModule {}
