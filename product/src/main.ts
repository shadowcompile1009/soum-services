import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoExceptionFilter } from '@src/exception-filters/mongo-exception.filter';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
let NewrelicInterceptor;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'qa') {
  NewrelicInterceptor = import('./newrelic.interceptor').then((data) => {
    NewrelicInterceptor = data.NewrelicInterceptor;
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  const configService = app.get(ConfigService);
  // NR integraion
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'qa-automation'
  ) {
    app.useGlobalInterceptors(new NewrelicInterceptor());
  }

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Product API')
      .setDescription('Product API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors
            .map((elem) => `Key ${elem.property} is Incorrect format`)
            .reduce((message, error) => `${message} ${error}, `, ''),
        );
      },
    }),
  );
  app.useGlobalFilters(new MongoExceptionFilter());
  app.enableCors();
  await app.listen(configService.get('PORT'));
  new Logger('APP').log(
    `🚀🚀🚀 APP server started at port: ${configService.get('PORT')}`,
  );
}
bootstrap();
