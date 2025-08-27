import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import {
  protobufPackage,
  COMMISSION_PACKAGE_NAME,
} from '../grpc/proto/commission.pb';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: COMMISSION_PACKAGE_NAME,
        useFactory: async (configService: ConfigService) => {
          const grpcHost =
            configService.get<string>('NODE_ENV') !== 'local'
              ? `soum-${configService.get<string>('COMMISSION_SVC')}-${configService.get<string>('PREFIX')}-srv:50051`
              : '0.0.0.0:50051';

          return {
            transport: Transport.GRPC,
            options: {
              url: grpcHost,
              package: protobufPackage,
              protoPath: join(
                './node_modules/soum-proto/proto/commission.proto',
              ),
            },
          };
        },
      },
    ]),
  ],
  providers: [CommissionService],
  controllers: [CommissionController],
  exports: [CommissionService],
})
export class CommissionModule {}
