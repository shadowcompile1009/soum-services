import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let error;

    this.logger.error(exception);
    switch (exception.code) {
      case 11000:
      case 11001:
        error = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.formatMongoDupAsValidationError(exception),
          error: 'Bad Request',
        };
        break;
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ['Internal Server Error'],
          error: 'Internal Error',
        };
        break;
      }
    }

    response.status(error.statusCode).json(error);
  }

  formatMongoDupAsValidationError = (error) => {
    // get name of the duplicated field
    let field = error.errmsg.substring(
      error.errmsg.lastIndexOf('index: ') + 'index: '.length,
      error.errmsg.lastIndexOf(' dup key:'),
    );

    field = field.substring(
      field.lastIndexOf('$') + '$'.length,
      field.lastIndexOf('_'),
    );
    return [`"${field}" must be unique`];
  };
}
