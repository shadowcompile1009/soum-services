import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protobufPackage } from '../grpc/proto/ler.pb';
import { join } from 'path';
import { LerService } from './ler.service';
import { LER_PACKAGE_NAME } from '../grpc/proto/ler.pb';

let grpcHost = '0.0.0.0:50059';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.LER_SVC}-${process.env.PREFIX}-srv:50051`;
}

@Module({
  providers: [LerService],
  imports: [
    ClientsModule.register([
      {
        name: LER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/ler.proto'),
        },
      },
    ]),
  ],
  exports: [LerService],
})
export class LerModule {}
