import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoExceptionFilter } from '@src/exception-filters/mongo-exception.filter';
import { AppModule } from './app.module';
let NewrelicInterceptor;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'qa') {
  NewrelicInterceptor = import('./newrelic.interceptor').then((data) => {
    NewrelicInterceptor = data.NewrelicInterceptor;
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // NR integraion
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'qa-automation'
  ) {
    app.useGlobalInterceptors(new NewrelicInterceptor());
  }
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('DM Backend API')
    .setDescription('DM Backend API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new MongoExceptionFilter());
  app.enableCors();
  await app.listen(configService.get('PORT'));
  new Logger('APP').log(
    `🚀🚀🚀 APP server started at port: ${configService.get('PORT')}`,
  );
}
bootstrap();
