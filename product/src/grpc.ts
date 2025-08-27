import { INestMicroservice, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { protobufPackage } from './modules/grpc/proto/product.pb';
import { emailPackage } from './modules/grpc/proto/email.pb';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const grpcApp: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${configService.get('GRPC_PORT')}`,
        package: [protobufPackage, emailPackage],
        protoPath: [
          join('./node_modules/soum-proto/proto/product.proto'),
          join('./src/modules/grpc/proto/email.proto'),
        ],
      },
    },
  );
  await grpcApp.listen();
  new Logger('GRPC').log(
    `🚀🚀🚀 GRPC server started at port: ${configService.get('GRPC_PORT')}`,
  );
}
bootstrap();
