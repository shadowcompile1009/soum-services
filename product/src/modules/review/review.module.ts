import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { REVIEW_PACKAGE_NAME } from '../grpc/proto/review.pb';
import { protobufPackage } from '../grpc/proto/review.pb';
import { ReviewService } from './review.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
let grpcHost = '0.0.0.0:50055';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.REVIEW_SVC}-${process.env.PREFIX}-srv:50051`;
}
@Module({
  providers: [ReviewService],
  imports: [
    ClientsModule.register([
      {
        name: REVIEW_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/review.proto'),
        },
      },
    ]),
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
