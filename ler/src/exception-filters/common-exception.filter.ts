import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ViolationsDto } from './violations.dto';
import { Request, Response } from 'express';
import { CommonExceptionFilterResponseError } from './common-exception-filter-response-error';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = (exception as any)?.message?.message;
    const violations = [];

    Logger.error(
      message,
      (exception as any)?.stack,
      `${request.method} ${request.url}`,
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception?.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case BadRequestException:
        status = (exception as BadRequestException).getStatus();
        message = (exception as BadRequestException).message;
        violations.push(new ViolationsDto(status, message, null));
        break;
      case UnauthorizedException:
        status = (exception as UnauthorizedException).getStatus();
        message = (exception as UnauthorizedException).message;
        violations.push(new ViolationsDto(status, message, null));
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = (exception as InternalServerErrorException).message;
        violations.push(new ViolationsDto(status, message, null));
    }

    response
      .status(status)
      .json(CommonExceptionFilterResponseError('fail', message, violations));
  }
}
