import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
  new Logger('APP').log(
    `🚀🚀🚀 Server started at port: ${configService.get('PORT')}`,
  );
}
bootstrap();
