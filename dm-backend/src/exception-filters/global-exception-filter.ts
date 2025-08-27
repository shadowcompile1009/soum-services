import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let errors = [
      { code: 'SERVER_ERROR', message: 'Unexpected error occured' },
    ];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      message = (responseBody as any)?.error || message;
      errors = (responseBody as any)?.message || errors;
    }

    response.status(status).json({
      statusCode: status,
      message,
      data: null,
      errors: errors,
      success: false,
    });
  }
}
