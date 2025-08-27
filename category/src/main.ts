import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
let NewrelicInterceptor;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'qa') {
  NewrelicInterceptor = import('./newrelic.interceptor').then((data) => {
    NewrelicInterceptor = data.NewrelicInterceptor;
  });
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

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

  if (process.env.NODE_ENV !== 'production') {
    // const globalPrefix = 'category';
    // app.setGlobalPrefix(globalPrefix);
    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Category API')
      .setDescription('Category API')
      .setVersion('1.0')
      .setBasePath('/category')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'token', // The header name, you can change this to your custom header name
          in: 'header', // The header where the token will be sent
        },
        'token', // This is a unique key used to reference the apiKey in the Swagger UI
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if unknown properties are passed
      stopAtFirstError: true, // Stop at the first validation error
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors
            .map((elem) => `Key ${elem.property} is Incorrect formate`)
            .reduce((message, error) => `${message} ${error},`, ''),
        );
      },
    }),
  );
  app.enableCors();
  await app.listen(configService.get('PORT'));
  new Logger('APP').log(
    `🚀🚀🚀 APP server started at port: ${configService.get('PORT')}`,
  );
}
bootstrap();
