import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoExceptionFilter } from '@src/exception-filters/mongo-exception.filter';
import { AppModule } from './app.module';
let NewrelicInterceptor;
if (
  process.env.ENVIRONMENT === 'production' ||
  process.env.ENVIRONMENT === 'qa'
) {
  NewrelicInterceptor = import('./newrelic.interceptor').then((data) => {
    NewrelicInterceptor = data.NewrelicInterceptor;
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // NR integraion
  if (
    process.env.ENVIRONMENT === 'production' ||
    process.env.ENVIRONMENT === 'qa'
  ) {
    app.useGlobalInterceptors(new NewrelicInterceptor());
  }

  if (process.env.ENVIRONMENT !== 'production') {
    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Wallet API')
      .setDescription('Wallet API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new MongoExceptionFilter());
  app.enableCors();
  await app.listen(configService.get('PORT'));
  new Logger('APP').log(
    `🚀🚀🚀 APP server started at port: ${configService.get('PORT')}`,
  );
}
bootstrap();
