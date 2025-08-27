import { Module } from '@nestjs/common';
import { AuthzController } from './authz.controller';
import { AuthzService } from './authz.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTHZ_PACKAGE_NAME, protobufPackage } from '../grpc/proto/authz.pb';
import { join } from 'path';

let grpcHost = '0.0.0.0:50059';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.AUTHZ_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  controllers: [AuthzController],
  providers: [AuthzService],
  imports: [
    ClientsModule.register([
      {
        name: AUTHZ_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/authz.proto'),
        },
      },
    ]),
  ],
  exports: [AuthzService],
})
export class AuthzModule {}
