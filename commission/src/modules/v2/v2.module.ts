import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { V2Service } from './v2.service';
import { V2Controller } from './v2.controller';
import { protobufPackage, V2_PACKAGE_NAME } from '../grpc/proto/v2.pb';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

let grpcHost = '0.0.0.0:50051';

if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.V2_SVC}-${process.env.PREFIX}-srv:50051`;
}

@Module({
  providers: [V2Service],
  controllers: [V2Controller],
  imports: [
    ClientsModule.register([
      {
        name: V2_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/v2.proto'),
        },
      },
    ]),
  ],
  exports: [V2Service],
})
export class V2Module {}
