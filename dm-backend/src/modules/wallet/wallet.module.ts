import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import dotenv from 'dotenv';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage, WALLET_PACKAGE_NAME } from '../grpc/proto/wallet.pb';

// Allow override of environment variables
dotenv.config();

let grpcHost = '0.0.0.0:50072';
if (process.env.NODE_ENV !== 'local') {
  grpcHost = `soum-${process.env.WALLET_SVC}-${process.env.PREFIX}-srv:50051`;
}

@Module({
  providers: [WalletService],
  imports: [
    ClientsModule.register([
      {
        name: WALLET_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: grpcHost,
          package: protobufPackage,
          protoPath: join('./node_modules/soum-proto/proto/wallet.proto'),
        },
      },
    ]),
  ],
  exports: [WalletService],
})
export class WalletModule {}
