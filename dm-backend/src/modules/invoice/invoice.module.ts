import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { InvoiceService } from './invoice.service';
import {
  INVOICE_PACKAGE_NAME,
  protobufPackage,
} from '../grpc/proto/invoice.pb';

let grpcHost = '0.0.0.0:50060';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.INVOICE_SVC}-${process.env.PREFIX}-srv:50051`;
}

@Module({
  providers: [InvoiceService],
  imports: [
    ClientsModule.register([
      {
        name: INVOICE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/invoice.proto'),
        },
      },
    ]),
  ],
  exports: [InvoiceService],
})
export class InvoiceModule {}
