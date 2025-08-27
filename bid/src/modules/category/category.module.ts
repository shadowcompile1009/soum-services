import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CATEGORY_PACKAGE_NAME,
  protobufPackage,
} from '../grpc/proto/category.pb';
import { join } from 'path';

let grpcHost = '0.0.0.0:50051';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.CATEGORY_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  providers: [CategoryService],
  imports: [
    ClientsModule.register([
      {
        name: CATEGORY_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/category.proto'),
        },
      },
    ]),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
