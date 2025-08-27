import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
  PRODUCT_PACKAGE_NAME,
  protobufPackage,
} from '../grpc/proto/product.pb';
import { join } from 'path';

let grpcHost = '0.0.0.0:50053';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-product-${process.env.PREFIX}-srv:50051`;
}

@Module({
  providers: [ProductService],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/product.proto'),
        },
      },
    ]),
  ],
  exports: [ProductService],
})
export class ProductModule {}
