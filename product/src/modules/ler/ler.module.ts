import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { LER_PACKAGE_NAME, protobufPackage } from '../grpc/proto/ler.pb';
import { LerController } from './ler.controller';
import { LerService } from './ler.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
let grpcHost = '0.0.0.0:50056';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.LER_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  providers: [LerService],
  controllers: [LerController],
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
