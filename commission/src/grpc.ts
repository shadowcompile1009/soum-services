import { INestMicroservice, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { protobufPackage } from './modules/grpc/proto/commission.pb';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const grpcApp: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${configService.get('GRPC_PORT')}`,
        package: protobufPackage,
        protoPath: join('./node_modules/soum-proto/proto/commission.proto'),
      },
    },
  );
  await grpcApp.listen();
  new Logger('GRPC').log(
    `🚀🚀🚀 GRPC server started at port: ${configService.get('GRPC_PORT')}`,
  );
}
bootstrap();
