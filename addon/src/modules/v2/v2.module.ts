import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { V2Service } from './v2.service';
import { V2Controller } from './v2.controller';
import { protobufPackage, V2_PACKAGE_NAME } from '../grpc/proto/v2.pb';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: V2_PACKAGE_NAME,
        useFactory: async (configService: ConfigService) => {
          const grpcHost =
            configService.get<string>('NODE_ENV') !== 'local'
              ? `soum-${configService.get<string>('V2_SVC')}-${configService.get<string>('PREFIX')}-srv:50051`
              : '0.0.0.0:50051';

          return {
            transport: Transport.GRPC,
            options: {
              url: grpcHost,
              package: protobufPackage,
              protoPath: join('./node_modules/soum-proto/proto/v2.proto'),
            },
          };
        },
      },
    ]),
  ],
  providers: [V2Service],
  controllers: [V2Controller],
  exports: [V2Service],
})
export class V2Module {}
