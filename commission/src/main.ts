import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

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
  if (process.env.NODE_ENV !== 'production') {
    // Swagger
    const config = new DocumentBuilder()
      .setTitle('commission API')
      .setDescription('commission API')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('/')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // to add basic service name
  // if (process.env.NODE_ENV !== 'local') app.setGlobalPrefix('/commission', {});
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
